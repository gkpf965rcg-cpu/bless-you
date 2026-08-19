#!/usr/bin/env node
"use strict";

const { execFileSync } = require("child_process");
const fs = require("fs");

function hasCredentials() {
  if (process.env.NOTARYTOOL_PROFILE) return true;
  if (process.env.APPLE_API_KEY && process.env.APPLE_API_KEY_ID && process.env.APPLE_API_ISSUER) return true;
  if (process.env.APPLE_ID && process.env.APPLE_APP_SPECIFIC_PASSWORD && process.env.APPLE_TEAM_ID) return true;
  return false;
}

function notaryArgs() {
  if (process.env.NOTARYTOOL_PROFILE) {
    return ["--keychain-profile", process.env.NOTARYTOOL_PROFILE];
  }
  if (process.env.APPLE_API_KEY) {
    return [
      "--key", process.env.APPLE_API_KEY,
      "--key-id", process.env.APPLE_API_KEY_ID,
      "--issuer", process.env.APPLE_API_ISSUER
    ];
  }
  return [
    "--apple-id", process.env.APPLE_ID,
    "--password", process.env.APPLE_APP_SPECIFIC_PASSWORD,
    "--team-id", process.env.APPLE_TEAM_ID
  ];
}

module.exports = async function afterAllArtifactBuild(buildResult) {
  const artifacts = buildResult.artifactPaths || [];
  const dmgs = artifacts.filter((item) => item.endsWith(".dmg") && fs.existsSync(item));
  if (!dmgs.length) return artifacts;

  if (!hasCredentials()) {
    console.warn("Skipping notarization (no Apple credentials). This build is not for public download.");
    return artifacts;
  }

  for (const dmg of dmgs) {
    console.log(`Notarizing ${dmg}...`);
    execFileSync("xcrun", ["notarytool", "submit", dmg, ...notaryArgs(), "--wait"], { stdio: "inherit" });
    execFileSync("xcrun", ["stapler", "staple", dmg], { stdio: "inherit" });
    console.log(`Stapled ${dmg}`);
  }

  return artifacts;
};
