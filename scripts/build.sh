#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"

DOWNLOADS="${ROOT}/website/downloads"
mkdir -p "${DOWNLOADS}"

echo "Generating icons..."
python3 "${ROOT}/scripts/make-icon.py"

if [[ ! -d "${ROOT}/node_modules" ]]; then
  echo "Installing npm dependencies..."
  npm install
fi

echo "Building app bundle..."
npm run build:app

if [[ -n "${CODESIGN_IDENTITY:-}" ]]; then
  export CSC_NAME="${CODESIGN_IDENTITY}"
  unset CSC_IDENTITY_AUTO_DISCOVERY || true
else
  echo "WARNING: CODESIGN_IDENTITY is not set. Skipping code signing and notarization. Not for public download." >&2
  echo "         Example: export CODESIGN_IDENTITY=\"Developer ID Application: Your Name (TEAMID)\"" >&2
  export CSC_IDENTITY_AUTO_DISCOVERY=false
fi

echo "Packaging universal Mac app..."
BUILDER_ARGS=(--mac)
if [[ -z "${CODESIGN_IDENTITY:-}" && -z "${CSC_NAME:-}" ]]; then
  # Skip signing locally. App Sandbox + Hardened Runtime require a Developer ID.
  export CSC_IDENTITY_AUTO_DISCOVERY=false
fi
npx electron-builder "${BUILDER_ARGS[@]}"

copy_artifact() {
  local pattern="$1"
  local dest="$2"
  local match
  match="$(ls -1 ${pattern} 2>/dev/null | head -n 1 || true)"
  if [[ -n "${match}" && -f "${match}" ]]; then
    cp "${match}" "${dest}"
    echo "Copied $(basename "${match}") -> ${dest}"
    return 0
  fi
  return 1
}

copy_artifact "${ROOT}/dist/BlessYou-mac.dmg" "${DOWNLOADS}/BlessYou-mac.dmg" || true
if [[ -f "${DOWNLOADS}/BlessYou-mac.dmg" ]]; then
  cp "${DOWNLOADS}/BlessYou-mac.dmg" "${DOWNLOADS}/BlessYou.dmg"
elif copy_artifact "${ROOT}/dist/*.dmg" "${DOWNLOADS}/BlessYou.dmg"; then
  cp "${DOWNLOADS}/BlessYou.dmg" "${DOWNLOADS}/BlessYou-mac.dmg"
fi

write_checksums() {
  local file="$1"
  [[ -f "${file}" ]] || return 0
  local hash version name
  hash="$(shasum -a 256 "${file}" | awk '{print $1}')"
  version="$(node -p "require('./package.json').version")"
  name="$(basename "${file}")"
  cat > "${DOWNLOADS}/SHA256SUMS" <<EOF
${hash}  BlessYou.dmg
${hash}  BlessYou-mac.dmg
EOF
  cat > "${DOWNLOADS}/latest.json" <<EOF
{"version":"${version}","file":"${name}","sha256":"${hash}"}
EOF
  echo "SHA-256 ${name}: ${hash}"
}

if [[ -f "${DOWNLOADS}/BlessYou.dmg" ]]; then
  write_checksums "${DOWNLOADS}/BlessYou.dmg"
fi

if [[ "${1:-}" == "--install" ]]; then
  APP_DIR="$(ls -d "${ROOT}"/dist/mac-universal/Bless\ You.app 2>/dev/null | head -n 1 || true)"
  if [[ -z "${APP_DIR}" ]]; then
    APP_DIR="$(ls -d "${ROOT}"/dist/mac*/Bless\ You.app 2>/dev/null | head -n 1 || true)"
  fi
  if [[ -n "${APP_DIR}" && "$(uname -s)" == "Darwin" ]]; then
    echo "Installing to /Applications..."
    rm -rf "/Applications/Bless You.app"
    cp -R "${APP_DIR}" "/Applications/"
    xattr -cr "/Applications/Bless You.app" || true
  else
    echo "No packaged Mac app found to install."
  fi
fi

if [[ -n "${CODESIGN_IDENTITY:-}" ]]; then
  "${ROOT}/scripts/audit-release.sh"
fi

echo
echo "Website downloads: ${DOWNLOADS}"
ls -lh "${DOWNLOADS}" 2>/dev/null || true
