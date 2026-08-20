"use strict";

const REQUIRED = [
  "com.apple.security.cs.allow-jit",
  "com.apple.security.cs.allow-unsigned-executable-memory"
];

const FORBIDDEN = [
  "com.apple.security.app-sandbox",
  "com.apple.security.inherit",
  "com.apple.security.application-groups",
  "com.apple.application-identifier",
  "com.apple.developer.team-identifier",
  "get-task-allow",
  "com.apple.security.network.client",
  "com.apple.security.network.server"
];

function entitlementKeys(xml) {
  const keys = [];
  const re = /<key>([^<]+)<\/key>/g;
  let match;
  while ((match = re.exec(String(xml || "")))) {
    keys.push(match[1].trim());
  }
  return keys;
}

function entitlementProblems(xml) {
  const problems = [];
  if (!xml || !String(xml).trim()) {
    problems.push("no entitlements");
    return problems;
  }
  const keys = entitlementKeys(xml);
  if (!keys.length) {
    problems.push("no entitlement keys");
    return problems;
  }
  for (const key of REQUIRED) {
    if (!keys.includes(key)) problems.push(`missing ${key}`);
  }
  for (const key of FORBIDDEN) {
    if (keys.includes(key)) problems.push(`forbidden ${key}`);
  }
  return problems;
}

module.exports = { REQUIRED, FORBIDDEN, entitlementKeys, entitlementProblems };
