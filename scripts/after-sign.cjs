"use strict";

const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const notarize = require("./notarize.cjs");
const { entitlementProblems } = require("./entitlements-policy.cjs");

function runCapture(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  return {
    status: result.status === 0,
    code: result.status,
    out: `${result.stdout || ""}${result.stderr || ""}`.trim()
  };
}

function fail(message, extra) {
  const suffix = extra ? `\n${extra}` : "";
  throw new Error(`afterSign: ${message}${suffix}`);
}

function codesignDisplay(target) {
  return runCapture("codesign", ["-dv", "--verbose=2", target]).out;
}

function entitlementsXml(target) {
  return runCapture("codesign", ["-d", "--entitlements", ":-", target]).out;
}

function verifyBundle(appPath) {
  const deep = runCapture("codesign", [
    "--verify",
    "--deep",
    "--strict",
    "--verbose=2",
    appPath
  ]);
  if (!deep.status) {
    fail(`codesign --verify --deep --strict failed for ${appPath}`, deep.out);
  }

  const strict = runCapture("codesign", [
    "--verify",
    "--strict",
    "--verbose=2",
    appPath
  ]);
  if (!strict.status) {
    fail(`codesign --verify --strict failed for ${appPath}`, strict.out);
  }
}

function assertSafeEntitlements(target) {
  const xml = entitlementsXml(target);
  const problems = entitlementProblems(xml);
  if (problems.length) {
    fail(`${target} entitlements are not safe for a public Developer ID build`, `${problems.join("\n")}\n${xml}`);
  }
}

function eachHelperApp(appPath, fn) {
  const frameworks = path.join(appPath, "Contents/Frameworks");
  if (!fs.existsSync(frameworks)) return;
  for (const name of fs.readdirSync(frameworks)) {
    if (!name.endsWith(".app")) continue;
    fn(path.join(frameworks, name));
  }
}

module.exports = async function afterSign(context) {
  if (context.electronPlatformName !== "darwin") return;

  const appPath = path.join(
    context.appOutDir,
    `${context.packager.appInfo.productFilename}.app`
  );
  if (!fs.existsSync(appPath)) {
    fail(`signed app missing at ${appPath}`);
  }

  const info = codesignDisplay(appPath);
  const release = process.env.ACH000_RELEASE === "1";
  const adhoc = /Signature=adhoc/i.test(info) || /Authority=adhoc/i.test(info);

  if (adhoc) {
    if (release) {
      fail("ad-hoc signature is not allowed for a public release", info);
    }
    console.warn(`afterSign: ad-hoc signature on ${appPath} (local build only; not for download)`);
    return;
  }

  if (/Authority=Apple Development/.test(info)) {
    fail(
      "Apple Development signature cannot be distributed. Use Developer ID Application.",
      info
    );
  }

  if (!/Authority=Developer ID Application:/.test(info)) {
    fail("signed app is not using Developer ID Application", info);
  }

  if (!/flags=.*runtime/.test(info)) {
    fail("Hardened Runtime is missing", info);
  }

  if (!/Timestamp=/.test(info)) {
    fail("secure timestamp is missing", info);
  }

  if (!/Identifier=app\.ach000\.desktop/.test(info)) {
    fail("bundle identifier is not app.ach000.desktop", info);
  }

  assertSafeEntitlements(appPath);
  eachHelperApp(appPath, assertSafeEntitlements);
  verifyBundle(appPath);
  console.log(`afterSign: verified Developer ID + Hardened Runtime for ${appPath}`);

  const isUniversal = /mac-universal/.test(context.appOutDir);
  if (release && isUniversal) {
    notarize.notarizeAndStapleApp(appPath);
  }
};
