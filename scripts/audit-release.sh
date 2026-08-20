#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

APP_BUNDLE=""
DMG=""

fail() {
  echo "audit-release: $*" >&2
  exit 1
}

find_app() {
  local match
  match="$(ls -d "${ROOT}"/dist/mac-universal/ach000.app 2>/dev/null | head -n 1 || true)"
  if [[ -z "${match}" ]]; then
    match="$(ls -d "${ROOT}"/dist/mac*/ach000.app 2>/dev/null | head -n 1 || true)"
  fi
  APP_BUNDLE="${match}"
}

find_dmg() {
  local match
  match="$(ls -1 "${ROOT}"/dist/ach000-mac.dmg 2>/dev/null | head -n 1 || true)"
  if [[ -z "${match}" ]]; then
    match="$(ls -1 "${ROOT}"/dist/*.dmg 2>/dev/null | head -n 1 || true)"
  fi
  DMG="${match}"
}

codesign_display() {
  codesign -dv --verbose=2 "$1" 2>&1 || true
}

find_app
find_dmg

[[ -n "${APP_BUNDLE}" && -d "${APP_BUNDLE}" ]] || fail "ach000.app not found under dist/"
[[ -n "${DMG}" && -f "${DMG}" ]] || fail "ach000-mac.dmg not found under dist/"

if [[ "$(basename "${DMG}")" != "ach000-mac.dmg" ]]; then
  fail "production artifact must be named ach000-mac.dmg, found $(basename "${DMG}")"
fi

BINARY="${APP_BUNDLE}/Contents/MacOS/ach000"
if [[ ! -f "${BINARY}" ]]; then
  BINARY="$(find "${APP_BUNDLE}/Contents/MacOS" -type f | head -n 1 || true)"
fi
[[ -n "${BINARY}" && -f "${BINARY}" ]] || fail "app executable not found"

echo "Verifying ${APP_BUNDLE}"
codesign --verify --deep --strict --verbose=2 "${APP_BUNDLE}"
codesign --verify --strict --verbose=2 "${APP_BUNDLE}"

echo "Verifying ${DMG}"
codesign --verify --verbose=2 "${DMG}"

node "${ROOT}/scripts/check-entitlements.cjs" || fail "source entitlements files are not safe"

assert_safe_ents() {
  local label="$1"
  local xml="$2"
  local problems=""
  if ! problems="$(node -e '
    const { entitlementProblems } = require(process.argv[1]);
    const fs = require("fs");
    const xml = fs.readFileSync(0, "utf8");
    const problems = entitlementProblems(xml);
    if (problems.length) {
      console.error(problems.join("\n"));
      process.exit(1);
    }
  ' "${ROOT}/scripts/entitlements-policy.cjs" <<<"${xml}" 2>&1)"; then
    fail "${label} entitlements are not safe for a public Developer ID build"$'\n'"${problems}"$'\n'"${xml}"
  fi
}

ENTITLEMENTS="$(codesign -d --entitlements :- "${APP_BUNDLE}" 2>/dev/null || true)"
assert_safe_ents "${APP_BUNDLE}" "${ENTITLEMENTS}"

if echo "${ENTITLEMENTS}" | grep -Eq "com.apple.security.files|com.apple.security.device.camera|com.apple.security.personal-information"; then
  fail "entitlements include files, camera, or personal-information access"
fi

PLIST_EXEC="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleExecutable' "${APP_BUNDLE}/Contents/Info.plist")"
[[ "${PLIST_EXEC}" == "$(basename "${BINARY}")" ]] || fail "CFBundleExecutable (${PLIST_EXEC}) does not match ${BINARY}"
[[ -x "${BINARY}" ]] || fail "executable bit is missing on ${BINARY}"

shopt -s nullglob
for HELPER in "${APP_BUNDLE}/Contents/Frameworks/"*.app; do
  HELPER_ENTS="$(codesign -d --entitlements :- "${HELPER}" 2>/dev/null || true)"
  assert_safe_ents "${HELPER}" "${HELPER_ENTS}"
done
shopt -u nullglob

SIGN_INFO="$(codesign_display "${APP_BUNDLE}")"
echo "${SIGN_INFO}" | grep -q "flags=.*runtime" || fail "Hardened Runtime is missing"
echo "${SIGN_INFO}" | grep -q "Authority=Developer ID Application:" || fail "Developer ID Application signature missing"
echo "${SIGN_INFO}" | grep -q "Timestamp=" || fail "secure timestamp missing"
echo "${SIGN_INFO}" | grep -q "Identifier=app.ach000.desktop" || fail "bundle identifier is not app.ach000.desktop"

if echo "${SIGN_INFO}" | grep -qi "Signature=adhoc"; then
  fail "ad-hoc signature; public downloads need Developer ID Application"
fi
if echo "${SIGN_INFO}" | grep -q "Authority=Apple Development"; then
  fail "development signature; public downloads need Developer ID Application"
fi

ARCHS="$(lipo -archs "${BINARY}" 2>/dev/null || true)"
echo "${ARCHS}" | grep -q "arm64" || fail "arm64 slice missing (${ARCHS})"
echo "${ARCHS}" | grep -q "x86_64" || fail "x86_64 slice missing (${ARCHS})"

xcrun stapler validate "${DMG}" >/dev/null || fail "DMG is not notarized/stapled: ${DMG}"
xcrun stapler validate "${APP_BUNDLE}" >/dev/null || fail "app is not notarized/stapled: ${APP_BUNDLE}"

echo "Assessing Gatekeeper on app"
SPCTL_APP="$(spctl --assess --type execute -vv "${APP_BUNDLE}" 2>&1 || true)"
echo "${SPCTL_APP}"
echo "${SPCTL_APP}" | grep -qi "accepted" || fail "spctl did not accept ${APP_BUNDLE}"
echo "${SPCTL_APP}" | grep -qi "Notarized Developer ID" || fail "spctl source is not Notarized Developer ID for ${APP_BUNDLE}"

echo "Assessing Gatekeeper on DMG"
SPCTL_DMG="$(spctl --assess --type open --context context:primary-signature -vv "${DMG}" 2>&1 || true)"
echo "${SPCTL_DMG}"
echo "${SPCTL_DMG}" | grep -qi "accepted" || fail "spctl did not accept ${DMG}"
echo "${SPCTL_DMG}" | grep -qi "Notarized Developer ID" || fail "spctl source is not Notarized Developer ID for ${DMG}"

QUARANTINE_DIR="$(mktemp -d /tmp/ach000-gatekeeper-XXXXXX)"
QUARANTINE_DMG="${QUARANTINE_DIR}/ach000-mac.dmg"
cp "${DMG}" "${QUARANTINE_DMG}"
xattr -w com.apple.quarantine "0081;$(printf '%x' "$(date +%s)");Safari;" "${QUARANTINE_DMG}"
echo "Assessing Gatekeeper on quarantined copy (simulates a website download)"
SPCTL_Q="$(spctl --assess --type open --context context:primary-signature -vv "${QUARANTINE_DMG}" 2>&1 || true)"
echo "${SPCTL_Q}"
echo "${SPCTL_Q}" | grep -qi "accepted" || fail "spctl did not accept quarantined ${QUARANTINE_DMG}"
rm -rf "${QUARANTINE_DIR}"

AUDIT_MOUNT="$(mktemp -d /tmp/ach000-dmg-mnt-XXXXXX)"
cleanup_audit_mount() {
  pkill -x ach000 2>/dev/null || true
  if [[ -n "${AUDIT_MOUNT:-}" && -d "${AUDIT_MOUNT}" ]]; then
    hdiutil detach "${AUDIT_MOUNT}" -quiet 2>/dev/null || true
    rmdir "${AUDIT_MOUNT}" 2>/dev/null || true
  fi
}
trap cleanup_audit_mount EXIT
echo "Mounting ${DMG} at ${AUDIT_MOUNT}"
hdiutil attach -nobrowse -readonly -mountpoint "${AUDIT_MOUNT}" "${DMG}" >/dev/null
DMG_APP="${AUDIT_MOUNT}/ach000.app"
[[ -d "${DMG_APP}" ]] || fail "ach000.app missing from DMG"
DMG_BIN="${DMG_APP}/Contents/MacOS/ach000"
[[ -x "${DMG_BIN}" ]] || fail "executable bit missing on app inside DMG"
DMG_ENTS="$(codesign -d --entitlements :- "${DMG_APP}" 2>/dev/null || true)"
assert_safe_ents "${DMG_APP}" "${DMG_ENTS}"

# A sandboxed Electron 42 build on Apple Silicon macOS 26 dies in ~200ms
# (V8 ThreadIsolation SIGTRAP). Catching the process only at spawn is not
# enough, and matching the DMG path misses App Translocation.
pkill -x ach000 2>/dev/null || true
echo "Launching app from DMG"
if ! open "${DMG_APP}"; then
  fail "open failed for app inside DMG"
fi
sleep 2
if ! pgrep -x ach000 >/dev/null; then
  fail "app inside DMG did not stay running after open"
fi
trap - EXIT
cleanup_audit_mount

echo "audit-release: ok"
echo "  app: ${APP_BUNDLE}"
echo "  dmg: ${DMG}"
echo "  arch: ${ARCHS}"
echo "  identity: $(echo "${SIGN_INFO}" | sed -n 's/^Authority=//p' | head -n 1)"
