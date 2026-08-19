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

ENTITLEMENTS="$(codesign -d --entitlements :- "${APP_BUNDLE}" 2>/dev/null || true)"
[[ -n "${ENTITLEMENTS}" ]] || fail "no entitlements on ${APP_BUNDLE}"

echo "${ENTITLEMENTS}" | grep -q "com.apple.security.app-sandbox" || fail "App Sandbox is missing"
echo "${ENTITLEMENTS}" | grep -q "com.apple.security.device.audio-input" || fail "microphone entitlement is missing"

echo "${ENTITLEMENTS}" | grep -q "get-task-allow" && fail "get-task-allow must not be set on a public build"

if echo "${ENTITLEMENTS}" | grep -Eq "com.apple.security.network.(client|server)|com.apple.security.files|com.apple.security.device.camera|com.apple.security.personal-information"; then
  fail "entitlements include network, files, camera, or personal-information access"
fi

# Restricted entitlements need a provisioning profile. Without one, macOS 26
# refuses to spawn the app (POSIX 163 / "The application can't be opened").
if echo "${ENTITLEMENTS}" | grep -q "com.apple.security.application-groups"; then
  fail "application-groups is not allowed on this Developer ID build"
fi
if echo "${ENTITLEMENTS}" | grep -q "com.apple.application-identifier"; then
  fail "application-identifier is not allowed on this Developer ID build"
fi

PLIST_EXEC="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleExecutable' "${APP_BUNDLE}/Contents/Info.plist")"
[[ "${PLIST_EXEC}" == "$(basename "${BINARY}")" ]] || fail "CFBundleExecutable (${PLIST_EXEC}) does not match ${BINARY}"
[[ -x "${BINARY}" ]] || fail "executable bit is missing on ${BINARY}"

HELPER="${APP_BUNDLE}/Contents/Frameworks/ach000 Helper.app"
if [[ -d "${HELPER}" ]]; then
  HELPER_ENTS="$(codesign -d --entitlements :- "${HELPER}" 2>/dev/null || true)"
  echo "${HELPER_ENTS}" | grep -q "com.apple.security.app-sandbox" || fail "helper is missing App Sandbox"
  echo "${HELPER_ENTS}" | grep -q "com.apple.security.inherit" || fail "helper is missing sandbox inherit"
fi

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
echo "Mounting ${DMG} at ${AUDIT_MOUNT}"
hdiutil attach -nobrowse -readonly -mountpoint "${AUDIT_MOUNT}" "${DMG}" >/dev/null
DMG_APP="${AUDIT_MOUNT}/ach000.app"
[[ -d "${DMG_APP}" ]] || fail "ach000.app missing from DMG"
DMG_BIN="${DMG_APP}/Contents/MacOS/ach000"
[[ -x "${DMG_BIN}" ]] || fail "executable bit missing on app inside DMG"
DMG_ENTS="$(codesign -d --entitlements :- "${DMG_APP}" 2>/dev/null || true)"
echo "${DMG_ENTS}" | grep -q "com.apple.security.application-groups" && fail "app inside DMG still has application-groups"
echo "${DMG_ENTS}" | grep -q "com.apple.application-identifier" && fail "app inside DMG still has application-identifier"

pkill -f "${DMG_APP}/Contents/MacOS/ach000" 2>/dev/null || true
echo "Launching app from DMG"
if ! open "${DMG_APP}"; then
  hdiutil detach "${AUDIT_MOUNT}" -quiet || true
  fail "open failed for app inside DMG"
fi
LAUNCH_OK=0
for _ in 1 2 3 4 5 6 7 8; do
  if pgrep -f "${DMG_APP}/Contents/MacOS/ach000" >/dev/null; then
    LAUNCH_OK=1
    break
  fi
  sleep 0.5
done
pkill -f "${DMG_APP}/Contents/MacOS/ach000" 2>/dev/null || true
hdiutil detach "${AUDIT_MOUNT}" -quiet || true
rmdir "${AUDIT_MOUNT}" 2>/dev/null || true
[[ "${LAUNCH_OK}" -eq 1 ]] || fail "app inside DMG did not stay running after open"

echo "audit-release: ok"
echo "  app: ${APP_BUNDLE}"
echo "  dmg: ${DMG}"
echo "  arch: ${ARCHS}"
echo "  identity: $(echo "${SIGN_INFO}" | sed -n 's/^Authority=//p' | head -n 1)"
