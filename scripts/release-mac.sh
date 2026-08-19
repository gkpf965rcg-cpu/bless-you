#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "${ROOT}"
# shellcheck source=signing-lib.sh
source "${ROOT}/scripts/signing-lib.sh"

DOWNLOADS="${ROOT}/website/downloads"
ARTIFACT_NAME="ach000-mac.dmg"
DIST_DMG="${ROOT}/dist/${ARTIFACT_NAME}"
CHECK_ONLY=0
SKIP_PUBLISH=0
FINISH_ONLY=0

for arg in "$@"; do
  case "${arg}" in
    --check) CHECK_ONLY=1 ;;
    --skip-publish) SKIP_PUBLISH=1 ;;
    --finish) FINISH_ONLY=1 ;;
  esac
done

require_prereqs() {
  local ok=1
  local identity=""
  identity="$(detect_developer_id_identity 2>/tmp/ach000-identity-err || true)"
  if [[ -z "${identity}" ]]; then
    print_missing_developer_id_help
    if [[ -s /tmp/ach000-identity-err ]]; then
      cat /tmp/ach000-identity-err >&2 || true
    fi
    ok=0
  else
    echo "Signing identity: ${identity}"
  fi

  if ! has_notary_credentials; then
    print_missing_notary_help
    ok=0
  else
    echo "Notarisation credentials: present"
  fi

  if [[ "${ok}" -eq 1 ]]; then
    return 0
  fi
  return 1
}

copy_and_publish() {
  mkdir -p "${DOWNLOADS}"
  rm -f "${DOWNLOADS}/BlessYou.dmg" "${DOWNLOADS}/BlessYou-mac.dmg" "${DOWNLOADS}/${ARTIFACT_NAME}"
  cp "${DIST_DMG}" "${DOWNLOADS}/${ARTIFACT_NAME}"

  local hash version tag
  hash="$(shasum -a 256 "${DIST_DMG}" | awk '{print $1}')"
  version="$(node -p "require('./package.json').version")"
  cat > "${DOWNLOADS}/SHA256SUMS" <<EOF
${hash}  ${ARTIFACT_NAME}
EOF
  cat > "${DOWNLOADS}/latest.json" <<EOF
{"version":"${version}","file":"${ARTIFACT_NAME}","sha256":"${hash}","notarized":true}
EOF

  echo
  echo "Production artifact: ${DIST_DMG}"
  echo "SHA-256: ${hash}"

  if [[ "${SKIP_PUBLISH}" -eq 1 ]]; then
    echo "Skipping GitHub upload (--skip-publish)."
    return 0
  fi

  if ! command -v gh >/dev/null 2>&1; then
    echo "gh is not installed; upload ${ARTIFACT_NAME} to the GitHub release so ach000.com can serve it." >&2
    return 0
  fi

  tag="v${version}"
  if gh release view "${tag}" >/dev/null 2>&1; then
    echo "Uploading ${ARTIFACT_NAME} to GitHub release ${tag}..."
    gh release upload "${tag}" "${DIST_DMG}" --clobber
    if gh release view "${tag}" --json assets --jq '.assets[].name' | grep -qx 'BlessYou.dmg'; then
      echo "Removing unsigned legacy GitHub asset BlessYou.dmg..."
      gh release delete-asset "${tag}" "BlessYou.dmg" --yes || true
    fi
    gh release edit "${tag}" --title "ach000 ${version}" >/dev/null
  else
    echo "Creating GitHub release ${tag}..."
    gh release create "${tag}" "${DIST_DMG}" --title "ach000 ${version}" --notes "Signed and notarised macOS disk image."
  fi

  echo "GitHub download URL: https://github.com/gkpf965rcg-cpu/bless-you/releases/latest/download/${ARTIFACT_NAME}"
  echo "release:mac: complete"
}

latest_notary_submission_id() {
  python3 - "${NOTARYTOOL_PROFILE:-ach000-notary}" <<'PY'
import json, subprocess, sys
profile = sys.argv[1]
raw = subprocess.check_output(
    ["xcrun", "notarytool", "history", "--keychain-profile", profile, "--output-format", "json"],
    text=True,
)
data = json.loads(raw)
items = data.get("history") or data.get("submissions") or []
if not items:
    sys.exit(1)
print(items[0]["id"])
PY
}

wait_staple_and_publish() {
  local submission_id="${NOTARY_SUBMISSION_ID:-}"
  [[ -f "${DIST_DMG}" ]] || {
    echo "release:mac --finish: ${DIST_DMG} not found. Run npm run release:mac first." >&2
    exit 1
  }
  if [[ -z "${submission_id}" ]]; then
    submission_id="$(latest_notary_submission_id)"
  fi
  echo "Waiting for Apple notarisation ${submission_id} (this can take a while)..."
  xcrun notarytool wait "${submission_id}" --keychain-profile "${NOTARYTOOL_PROFILE}" --timeout 90m
  local info status
  info="$(xcrun notarytool info "${submission_id}" --keychain-profile "${NOTARYTOOL_PROFILE}" --output-format json)"
  echo "${info}"
  status="$(python3 -c 'import json,sys; print(json.load(sys.stdin).get("status",""))' <<<"${info}")"
  if [[ "${status}" != "Accepted" ]]; then
    xcrun notarytool log "${submission_id}" --keychain-profile "${NOTARYTOOL_PROFILE}" || true
    echo "release:mac --finish: notarisation status is ${status}, not Accepted." >&2
    exit 1
  fi
  echo "Stapling ${DIST_DMG}..."
  xcrun stapler staple "${DIST_DMG}"
  xcrun stapler validate "${DIST_DMG}"
  "${ROOT}/scripts/audit-release.sh"
  copy_and_publish
}

if [[ "${CHECK_ONLY}" -eq 1 ]]; then
  if require_prereqs; then
    echo "release:mac prereqs ok"
    exit 0
  fi
  exit 1
fi

if ! require_prereqs; then
  echo "release:mac: refusing to build a public download until signing and notarisation are configured." >&2
  exit 1
fi

export NOTARYTOOL_PROFILE="${NOTARYTOOL_PROFILE:-ach000-notary}"

if [[ "${FINISH_ONLY}" -eq 1 ]]; then
  wait_staple_and_publish
  exit 0
fi

IDENTITY="$(detect_developer_id_identity)"
export ACH000_RELEASE=1
export ACH000_SIGN_IDENTITY="${IDENTITY}"
export NOTARYTOOL_PROFILE="${NOTARYTOOL_PROFILE:-ach000-notary}"
# electron-builder throws if identity/CSC_NAME includes "Developer ID Application:".
# Leave mac.identity unset and do not pass CSC_NAME so it auto-selects
# the Developer ID Application certificate.
unset CODESIGN_IDENTITY || true
unset CSC_NAME || true
unset CSC_IDENTITY_AUTO_DISCOVERY || true

echo "codesign identity: ${IDENTITY}"
echo "electron-builder: auto-select Developer ID Application (no identity prefix)"
echo "notarytool profile: ${NOTARYTOOL_PROFILE}"

echo "Generating icons..."
python3 "${ROOT}/scripts/make-icon.py"

if [[ ! -d "${ROOT}/node_modules" ]]; then
  echo "Installing npm dependencies..."
  npm install
fi

echo "Building app assets..."
npm run build:app

echo "Packaging, signing, notarising, and stapling universal Mac app..."
npx electron-builder --mac -c.mac.forceCodeSigning=true

[[ -f "${DIST_DMG}" ]] || {
  echo "release:mac: expected ${DIST_DMG} was not produced." >&2
  ls -lh "${ROOT}/dist"/*.dmg 2>/dev/null || true
  exit 1
}

"${ROOT}/scripts/audit-release.sh"

copy_and_publish
