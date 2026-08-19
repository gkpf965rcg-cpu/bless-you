"use strict";

const TO_EMAIL = "christiegriffiths@outlook.com";
const MAX_MESSAGE = 2000;
const MAX_EMAIL = 254;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;

const hits = new Map();

function clientIp(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "")
    .split(",")[0]
    .trim();
  return forwarded || String(req.socket?.remoteAddress || "unknown");
}

function tooMany(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

function allowedOrigin(req) {
  const origin = String(req.headers.origin || "");
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host.split(",")[0].trim();
  } catch {
    return false;
  }
}

function cleanText(value, max) {
  return String(value || "")
    .replace(/\0/g, "")
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, max);
}

function validEmail(value) {
  if (!value) return true;
  if (value.length > MAX_EMAIL) return false;
  if (/[\r\n]/.test(value)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    json(res, 405, { error: "Could not send feedback." });
    return;
  }
  if (!allowedOrigin(req)) {
    json(res, 403, { error: "Could not send feedback." });
    return;
  }
  if (!String(req.headers["content-type"] || "").toLowerCase().includes("application/json")) {
    json(res, 400, { error: "Could not send feedback." });
    return;
  }

  const ip = clientIp(req);
  if (tooMany(ip)) {
    json(res, 429, { error: "Could not send feedback." });
    return;
  }

  let payload = {};
  try {
    if (req.body && typeof req.body === "object") {
      payload = req.body;
    } else if (typeof req.body === "string") {
      payload = JSON.parse(req.body || "{}");
    } else {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const raw = Buffer.concat(chunks);
      if (raw.length > 8000) {
        json(res, 413, { error: "Could not send feedback." });
        return;
      }
      payload = JSON.parse(raw.toString("utf8") || "{}");
    }
  } catch {
    json(res, 400, { error: "Could not send feedback." });
    return;
  }

  if (cleanText(payload.company, 100)) {
    json(res, 200, { ok: true });
    return;
  }

  const message = cleanText(payload.message, MAX_MESSAGE);
  const email = cleanText(payload.email, MAX_EMAIL);
  if (!message || !validEmail(email)) {
    json(res, 400, { error: "Could not send feedback." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    json(res, 503, { error: "Could not send feedback." });
    return;
  }

  const from = process.env.FEEDBACK_FROM_EMAIL || "ach000 <onboarding@resend.dev>";
  const replyLine = email ? `Reply-to: ${email}\n\n` : "";
  const text = `${replyLine}${message}`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [TO_EMAIL],
        subject: "ach000 feedback",
        text
      })
    });
    if (!response.ok) {
      json(res, 502, { error: "Could not send feedback." });
      return;
    }
  } catch {
    json(res, 502, { error: "Could not send feedback." });
    return;
  }

  json(res, 200, { ok: true });
};
