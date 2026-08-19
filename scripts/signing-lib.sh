# Shared macOS signing helpers. Sourced by release scripts. Not executed directly.

detect_developer_id_identity() {
  local identities
  identities="$(security find-identity -v -p codesigning 2>/dev/null | sed -n 's/.*"\(Developer ID Application: .*\)"/\1/p')"
  if [[ -z "${identities}" ]]; then
    return 1
  fi
  local count
  count="$(printf '%s\n' "${identities}" | grep -c .)"
  if [[ "${count}" -gt 1 ]]; then
    echo "Multiple Developer ID Application identities found:" >&2
    printf '%s\n' "${identities}" >&2
    return 1
  fi
  printf '%s\n' "${identities}"
}

# electron-builder / app-builder prepend "Developer ID Application: " themselves.
# Passing the full Keychain common name makes lookup fail with a doubled prefix.
electron_builder_identity_qualifier() {
  local full="$1"
  printf '%s\n' "${full#Developer ID Application: }"
}

print_missing_developer_id_help() {
  cat >&2 <<'EOF'
ACTION REQUIRED FROM CHRISTIE: Apple Developer ID certificate is missing.

This Mac only has an Apple Development certificate. Gatekeeper will not accept
that (or ad-hoc signing) for a website download.

Do these steps once:

1. Enrol in the Apple Developer Program if you are not already:
   https://developer.apple.com/programs/

2. Create and install a Developer ID Application certificate (not Apple
   Development, not Mac App Store):
   Xcode → Settings → Accounts → your Apple ID → Manage Certificates
   → + → Developer ID Application
   or
   https://developer.apple.com/account/resources/certificates/add
   → Developer ID Application

3. Confirm it is installed:

   security find-identity -v -p codesigning

   You must see a line like:
   Developer ID Application: Your Name (TEAMID)

4. Then run: npm run release:mac
EOF
}

notary_profile_name() {
  printf '%s\n' "${NOTARYTOOL_PROFILE:-ach000-notary}"
}

has_apple_id_notary_env() {
  [[ -n "${APPLE_ID:-}" && -n "${APPLE_APP_SPECIFIC_PASSWORD:-}" && -n "${APPLE_TEAM_ID:-}" ]]
}

has_api_key_notary_env() {
  [[ -n "${APPLE_API_KEY:-}" && -n "${APPLE_API_KEY_ID:-}" && -n "${APPLE_API_ISSUER:-}" ]]
}

has_notarytool_profile() {
  local profile
  profile="$(notary_profile_name)"
  xcrun notarytool history --keychain-profile "${profile}" >/dev/null 2>&1
}

has_notary_credentials() {
  has_apple_id_notary_env || has_api_key_notary_env || has_notarytool_profile
}

print_missing_notary_help() {
  local profile
  profile="$(notary_profile_name)"
  cat >&2 <<EOF
ACTION REQUIRED FROM CHRISTIE: Apple notarisation credentials are missing.

After the Developer ID certificate is installed, store notarytool credentials
in Keychain (preferred):

1. Create an app-specific password at https://appleid.apple.com
   (Sign-In and Security → App-Specific Passwords).

2. Run:

   xcrun notarytool store-credentials "${profile}" \\
     --apple-id "YOUR_APPLE_ID" \\
     --team-id "YOUR_TEAM_ID" \\
     --password "APP_SPECIFIC_PASSWORD"

   Your existing Apple Development certificate uses team ID ZFBK2N443V;
   confirm that same team ID on https://developer.apple.com/account.

3. Then run: npm run release:mac

Alternatively set one of these env combinations (never commit the values):

   NOTARYTOOL_PROFILE=${profile}

   APPLE_ID / APPLE_APP_SPECIFIC_PASSWORD / APPLE_TEAM_ID

   APPLE_API_KEY (path to AuthKey_XXXXXXXXXX.p8) / APPLE_API_KEY_ID / APPLE_API_ISSUER
EOF
}
