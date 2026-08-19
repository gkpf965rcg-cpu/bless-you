"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    ...options
  });
  return {
    status: result.status === 0,
    code: result.status,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    out: `${result.stdout || ""}${result.stderr || ""}`.trim()
  };
}

function fail(message, extra) {
  const suffix = extra ? `\n${extra}` : "";
  throw new Error(`notarize: ${message}${suffix}`);
}

function notaryArgs() {
  if (process.env.APPLE_API_KEY && process.env.APPLE_API_KEY_ID && process.env.APPLE_API_ISSUER) {
    return [
      "--key", process.env.APPLE_API_KEY,
      "--key-id", process.env.APPLE_API_KEY_ID,
      "--issuer", process.env.APPLE_API_ISSUER
    ];
  }
  if (process.env.APPLE_ID && process.env.APPLE_APP_SPECIFIC_PASSWORD && process.env.APPLE_TEAM_ID) {
    return [
      "--apple-id", process.env.APPLE_ID,
      "--password", process.env.APPLE_APP_SPECIFIC_PASSWORD,
      "--team-id", process.env.APPLE_TEAM_ID
    ];
  }
  const profile = process.env.NOTARYTOOL_PROFILE || "ach000-notary";
  return ["--keychain-profile", profile];
}

function hasCredentials() {
  if (process.env.APPLE_API_KEY && process.env.APPLE_API_KEY_ID && process.env.APPLE_API_ISSUER) return true;
  if (process.env.APPLE_ID && process.env.APPLE_APP_SPECIFIC_PASSWORD && process.env.APPLE_TEAM_ID) return true;
  const profile = process.env.NOTARYTOOL_PROFILE || "ach000-notary";
  return run("xcrun", ["notarytool", "history", "--keychain-profile", profile]).status;
}

function parseJson(text) {
  const trimmed = text.trim();
  if (!trimmed) return null;
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    return null;
  }
}

function fetchLog(submissionId) {
  if (!submissionId) return;
  console.error(`Fetching notarisation log for ${submissionId}...`);
  const result = run("xcrun", ["notarytool", "log", submissionId, ...notaryArgs()]);
  if (result.out) console.error(result.out);
}

function staple(file) {
  for (let attempt = 1; attempt <= 6; attempt += 1) {
    const result = run("xcrun", ["stapler", "staple", "-v", file]);
    if (result.status) {
      console.log(`Stapled ${file}`);
      return;
    }
    console.warn(`stapler staple attempt ${attempt} failed; retrying in 10s`);
    if (result.out) console.warn(result.out);
    spawnSync("sleep", ["10"]);
  }
  fail(`could not staple ${file}`);
}

function resolveCodesignIdentity() {
  const full = process.env.ACH000_SIGN_IDENTITY || "";
  if (full.startsWith("Developer ID Application:")) return full;
  const qualifier = process.env.CSC_NAME || process.env.CODESIGN_IDENTITY || "";
  if (qualifier.startsWith("Developer ID Application:")) return qualifier;
  if (qualifier) return `Developer ID Application: ${qualifier}`;
  const listed = run("security", ["find-identity", "-v", "-p", "codesigning"]);
  const match = listed.out.match(/"(Developer ID Application: [^"]+)"/);
  if (match) return match[1];
  return "";
}

function zipApp(appPath) {
  const zipPath = `${appPath.replace(/\.app\/?$/, "")}-notarize.zip`;
  try {
    fs.unlinkSync(zipPath);
  } catch {
    // ignore missing zip
  }
  const result = run("ditto", ["-c", "-k", "--keepParent", appPath, zipPath]);
  if (!result.status) {
    fail(`could not zip ${appPath} for notarisation`, result.out);
  }
  return zipPath;
}

function stapleAppIfPossible(appPath) {
  const result = run("xcrun", ["stapler", "staple", "-v", appPath]);
  if (result.status) {
    console.log(`Stapled ${appPath}`);
    return true;
  }
  return false;
}

function notarizeAndStapleApp(appPath) {
  if (!fs.existsSync(appPath)) {
    fail(`app missing for notarisation: ${appPath}`);
  }
  if (!hasCredentials()) {
    fail("Apple notarisation credentials are missing. Run npm run release:mac:check");
  }
  const zipPath = zipApp(appPath);
  try {
    submitAndWait(zipPath);
  } finally {
    try {
      fs.unlinkSync(zipPath);
    } catch {
      // ignore
    }
  }
  staple(appPath);
  const validate = run("xcrun", ["stapler", "validate", appPath]);
  if (!validate.status) {
    fail(`stapler validate failed for ${appPath}`, validate.out);
  }
}

function signDmg(dmg) {
  const identity = resolveCodesignIdentity();
  if (!identity.startsWith("Developer ID Application:")) {
    fail("refusing to notarise a DMG without a Developer ID Application identity");
  }
  const result = run("codesign", ["--force", "--sign", identity, "--timestamp", dmg]);
  if (!result.status) {
    fail(`could not sign ${dmg}`, result.out);
  }
  const verify = run("codesign", ["--verify", "--verbose=2", dmg]);
  if (!verify.status) {
    fail(`DMG codesign verification failed for ${dmg}`, verify.out);
  }
  console.log(`Signed DMG with ${identity}`);
}

function isTimeout(parsed, text) {
  const blob = `${JSON.stringify(parsed || {})}\n${text || ""}`;
  return /Timeout of \d+ second/i.test(blob) || /timed? out/i.test(blob);
}

function submissionStatus(submissionId) {
  const result = run("xcrun", [
    "notarytool",
    "info",
    submissionId,
    ...notaryArgs(),
    "--output-format",
    "json"
  ]);
  return parseJson(result.stdout) || parseJson(result.out);
}

function waitForSubmission(submissionId) {
  console.log(`Waiting for Apple notarisation ${submissionId}...`);
  const waited = run("xcrun", [
    "notarytool",
    "wait",
    submissionId,
    ...notaryArgs(),
    "--timeout",
    "90m",
    "--output-format",
    "json"
  ]);
  const parsed = parseJson(waited.stdout) || parseJson(waited.out) || submissionStatus(submissionId);
  if (parsed && parsed.status) return parsed;
  return submissionStatus(submissionId);
}

function submitAndWait(dmg) {
  console.log(`Submitting ${dmg} to Apple notary service...`);
  const result = run("xcrun", [
    "notarytool",
    "submit",
    dmg,
    ...notaryArgs(),
    "--wait",
    "--timeout",
    "90m",
    "--output-format",
    "json"
  ]);
  const parsed = parseJson(result.stdout) || parseJson(result.out);
  let submissionId = parsed && (parsed.id || parsed.submissionID);
  let status = parsed && (parsed.status || parsed.Status);

  if (submissionId && (isTimeout(parsed, result.out) || (status && status !== "Accepted" && status !== "Invalid" && status !== "Rejected"))) {
    console.warn(`notarytool still processing ${submissionId}; continuing to wait`);
    const waited = waitForSubmission(submissionId);
    status = waited && (waited.status || waited.Status);
    submissionId = (waited && (waited.id || waited.submissionID)) || submissionId;
  }

  if (status && status !== "Accepted") {
    fetchLog(submissionId);
    fail(`Apple notarisation returned ${status} for ${path.basename(dmg)}`);
  }

  if (!result.status && !isTimeout(parsed, result.out)) {
    fetchLog(submissionId);
    fail(`notarytool submit failed for ${dmg}`, result.out);
  }

  if (status !== "Accepted") {
    fetchLog(submissionId);
    fail(`Apple notarisation did not return Accepted for ${path.basename(dmg)}`, result.out);
  }

  console.log(`Notarisation Accepted for ${path.basename(dmg)}${submissionId ? ` (${submissionId})` : ""}`);
}

module.exports = async function afterAllArtifactBuild(buildResult) {
  const artifacts = buildResult.artifactPaths || [];
  const dmgs = artifacts.filter((item) => item.endsWith(".dmg"));
  const release = process.env.ACH000_RELEASE === "1";

  if (!release) {
    console.warn("Skipping notarization (not npm run release:mac). This build is not for public download.");
    return artifacts;
  }

  if (!dmgs.length) {
    fail("no DMG artifacts to notarise");
  }

  if (!hasCredentials()) {
    fail("Apple notarisation credentials are missing. Run npm run release:mac:check");
  }

  for (const dmg of dmgs) {
    signDmg(dmg);
    submitAndWait(dmg);
    staple(dmg);
    const validate = run("xcrun", ["stapler", "validate", dmg]);
    if (!validate.status) {
      fail(`stapler validate failed for ${dmg}`, validate.out);
    }
  }

  const appPath = path.join(__dirname, "..", "dist", "mac-universal", "ach000.app");
  if (fs.existsSync(appPath)) {
    if (!stapleAppIfPossible(appPath)) {
      console.warn(`stapler could not staple ${appPath} from the DMG ticket; app was notarised in afterSign if this is a universal release`);
    }
  }

  return artifacts;
};

module.exports.notarizeAndStapleApp = notarizeAndStapleApp;
