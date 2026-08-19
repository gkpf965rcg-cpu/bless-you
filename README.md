# ach000

A tiny Mac menu bar app that listens for sneezes and says “bless you.” Audio is classified on your computer and never recorded or uploaded.

Version 1 is **macOS only**. Detection is modular so a Windows port can be added later; this release does not build or sign Windows.

## Download and install

Host the `website/` folder over **HTTPS**, then:

1. Download `BlessYou.dmg`.
2. Optional: check the SHA-256 on the download page against `shasum -a 256 BlessYou.dmg`.
3. Open the disk image and drag **ach000** into **Applications**.
4. Open ach000 and allow the microphone when asked.
5. Look for the a in the menu bar.

Notarized Developer ID builds open normally in Gatekeeper. If you built from source without signing credentials, macOS may warn that the app is from an unidentified developer.

The app does not update itself. Download a new signed disk image from the website when you want a newer version.

## Privacy

- Microphone audio is processed entirely on-device and discarded.
- The Mac app is sandboxed **without network permission**, so it cannot upload audio.
- There are no accounts, analytics, telemetry, or crash reporters.
- Local preferences store only sensitivity, login-item choice, and a sneeze count.

See [website/privacy.html](website/privacy.html).

## Build from source

Requires macOS 14+, Node.js 18+, and Xcode command line tools.

```bash
chmod +x scripts/*.sh
npm install
./scripts/build.sh --install
./scripts/serve-website.sh
```

Then open [http://127.0.0.1:8787](http://127.0.0.1:8787) (loopback only) or launch **ach000** from Applications.

Local preview uses HTTP on `127.0.0.1`. Public downloads must be served over HTTPS.

### Signed public release

You need an Apple Developer Program membership and a **Developer ID Application** certificate.

```bash
export CODESIGN_IDENTITY="Developer ID Application: Your Name (TEAMID)"
# One of:
export NOTARYTOOL_PROFILE="notarytool-profile"
# or
export APPLE_ID="you@example.com"
export APPLE_APP_SPECIFIC_PASSWORD="app-specific-password"
export APPLE_TEAM_ID="TEAMID"
# or App Store Connect API key:
# export APPLE_API_KEY="/path/to/AuthKey_XXXXXXXXXX.p8"
# export APPLE_API_KEY_ID="XXXXXXXXXX"
# export APPLE_API_ISSUER="issuer-uuid"

./scripts/build.sh
./scripts/audit-release.sh
```

Without `CODESIGN_IDENTITY`, the build is ad-hoc signed and **not for public download**.

## How sneeze detection works

ach000 prefers [YAMNet](https://www.tensorflow.org/hub/tutorials/yamnet) via MediaPipe, bundled with the app. If the model cannot load, it uses an on-device acoustic detector. It ignores coughs when a cough scores higher than a sneeze, waits a few seconds between blessings, and never writes audio to disk.

Classifier backends live under `src/detection/` behind a small `SneezeClassifying` contract so another on-device engine can be added later.
