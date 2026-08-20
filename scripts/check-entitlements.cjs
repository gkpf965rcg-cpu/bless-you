"use strict";

const fs = require("fs");
const path = require("path");
const { entitlementProblems } = require("./entitlements-policy.cjs");

const root = path.join(__dirname, "..");
const files = [
  "build/entitlements.mac.plist",
  "build/entitlements.mac.inherit.plist"
];

let failed = false;

function check(label, ok, detail) {
  if (ok) {
    console.log(`${label}: ok`);
    return;
  }
  console.error(`${label}: ${detail || "failed"}`);
  failed = true;
}

for (const rel of files) {
  const xml = fs.readFileSync(path.join(root, rel), "utf8");
  const problems = entitlementProblems(xml);
  if (problems.length) {
    console.error(`${rel}:`);
    for (const problem of problems) console.error(`  ${problem}`);
    failed = true;
  } else {
    console.log(`${rel}: ok`);
  }
}

const commentOnly = `<!-- do not enable com.apple.security.app-sandbox -->
<plist><dict>
<key>com.apple.security.cs.allow-jit</key><true/>
<key>com.apple.security.cs.allow-unsigned-executable-memory</key><true/>
</dict></plist>`;
check(
  "comments mentioning sandbox are not keys",
  entitlementProblems(commentOnly).length === 0,
  entitlementProblems(commentOnly).join(", ")
);

const sandboxed = `<?xml version="1.0"?>
<plist><dict>
<key>com.apple.security.app-sandbox</key><true/>
<key>com.apple.security.cs.allow-jit</key><true/>
<key>com.apple.security.cs.allow-unsigned-executable-memory</key><true/>
</dict></plist>`;
check(
  "App Sandbox is rejected",
  entitlementProblems(sandboxed).includes("forbidden com.apple.security.app-sandbox"),
  entitlementProblems(sandboxed).join(", ")
);

if (failed) process.exit(1);
