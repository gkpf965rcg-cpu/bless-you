#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

APP_BUNDLE=""
DMG=""

find_app() {
  local match
  match="$(ls -d "${ROOT}"/dist/mac-universal/Bless\ You.app 2>/dev/null | head -n 1 || true)"
  if [[ -z "${match}" ]]; then
    match="$(ls -d "${ROOT}"/dist/mac*/Bless\ You.app 2>/dev/null | head -n 1 || true)"
  fi
  APP_BUNDLE="${match}"
}

find_dmg() {
  local match
  match="$(ls -1 "${ROOT}"/dist/BlessYou-mac.dmg 2>/dev/null | head -n 1 || true)"
  if [[ -z "${match}" ]]; then
    match="$(ls -1 "${ROOT}"/dist/*.dmg 2>/dev/null | head -n 1 || true)"
  fi
  DMG="${match}"
}

fail() {
  echo "audit-release: $*" >&2
  exit 1
}

find_app
find_dmg

[[ -n "${APP_BUNDLE}" && -d "${APP_BUNDLE}" ]] || fail "Bless You.app not found under dist/"
[[ -n "${DMG}" && -f "${DMG}" ]] || fail "BlessYou DMG not found under dist/"

BINARY="${APP_BUNDLE}/Contents/MacOS/Bless You"
if [[ ! -f "${BINARY}" ]]; then
  BINARY="$(find "${APP_BUNDLE}/Contents/MacOS" -type f | head -n 1 || true)"
fi
[[ -n "${BINARY}" && -f "${BINARY}" ]] || fail "app executable not found"

ENTITLEMENTS="$(codesign -d --entitlements :- "${APP_BUNDLE}" 2>/dev/null || true)"
[[ -n "${ENTITLEMENTS}" ]] || fail "no entitlements on ${APP_BUNDLE}"

echo "${ENTITLEMENTS}" | grep -q "com.apple.security.app-sandbox" || fail "App Sandbox is missing"
echo "${ENTITLEMENTS}" | grep -q "com.apple.security.device.audio-input" || fail "microphone entitlement is missing"

echo "${ENTITLEMENTS}" | grep -q "get-task-allow" && fail "get-task-allow must not be set on a public build"

if echo "${ENTITLEMENTS}" | grep -Eq "com.apple.security.network.(client|server)|com.apple.security.files|com.apple.security.device.camera|com.apple.security.personal-information"; then
  fail "entitlements include network, files, camera, or personal-information access"
fi

SIGN_INFO="$(codesign -dv --verbose=2 "${APP_BUNDLE}" 2>&1 || true)"
echo "${SIGN_INFO}" | grep -q "flags=.*runtime" || fail "Hardened Runtime is missing"

if echo "${SIGN_INFO}" | grep -qi "Signature=adhoc"; then
  fail "ad-hoc signature; set CODESIGN_IDENTITY to a Developer ID Application certificate"
fi
if echo "${SIGN_INFO}" | grep -q "Authority=Apple Development"; then
  fail "development signature; public downloads need Developer ID Application"
fi

ARCHS="$(lipo -archs "${BINARY}" 2>/dev/null || true)"
echo "${ARCHS}" | grep -q "arm64" || fail "arm64 slice missing (${ARCHS})"
echo "${ARCHS}" | grep -q "x86_64" || fail "x86_64 slice missing (${ARCHS})"

stapler validate "${DMG}" >/dev/null 2>&1 || fail "DMG is not notarized/stapled: ${DMG}"

echo "audit-release: ok"
echo "  app: ${APP_BUNDLE}"
echo "  dmg: ${DMG}"
echo "  arch: ${ARCHS}"
