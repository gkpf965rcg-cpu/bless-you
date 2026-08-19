#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

echo "Local Mac package only. Public downloads must use: npm run release:mac"

echo "Generating icons..."
python3 "${ROOT}/scripts/make-icon.py"

if [[ ! -d "${ROOT}/node_modules" ]]; then
  echo "Installing npm dependencies..."
  npm install
fi

echo "Building app bundle..."
npm run build:app

if [[ -n "${CODESIGN_IDENTITY:-}" && "${CODESIGN_IDENTITY}" == Developer\ ID\ Application:* ]]; then
  export CSC_NAME="${CODESIGN_IDENTITY#Developer ID Application: }"
  unset CSC_IDENTITY_AUTO_DISCOVERY || true
  echo "Signing local package with ${CODESIGN_IDENTITY}"
else
  echo "WARNING: no Developer ID Application identity. Local package will be unsigned/ad-hoc and must not be downloaded from the website." >&2
  unset CSC_NAME || true
  export CSC_IDENTITY_AUTO_DISCOVERY=false
fi

echo "Packaging universal Mac app..."
npx electron-builder --mac

if [[ "${1:-}" == "--install" ]]; then
  APP_DIR="$(ls -d "${ROOT}"/dist/mac-universal/ach000.app 2>/dev/null | head -n 1 || true)"
  if [[ -z "${APP_DIR}" ]]; then
    APP_DIR="$(ls -d "${ROOT}"/dist/mac*/ach000.app 2>/dev/null | head -n 1 || true)"
  fi
  if [[ -n "${APP_DIR}" && "$(uname -s)" == "Darwin" ]]; then
    echo "Installing to /Applications..."
    rm -rf "/Applications/ach000.app"
    cp -R "${APP_DIR}" "/Applications/"
  else
    echo "No packaged Mac app found to install."
  fi
fi

echo
echo "Local artifacts are in dist/. They are not published to the website."
ls -lh "${ROOT}/dist"/*.dmg 2>/dev/null || true
