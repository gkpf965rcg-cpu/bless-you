# ach000

A tiny Mac menu bar app that listens for sneezes and says “bless you.” Audio is classified on your computer and never recorded or uploaded.

Version 1 is **macOS only**. Detection is modular so a Windows port can be added later; this release does not build or sign Windows.

## Download and install

1. Download `ach000-mac.dmg` from [ach000.com](https://www.ach000.com).
2. Open the disk image and drag **ach000** into **Applications**.
3. Open ach000 and allow the microphone when asked.
4. Look for the a in the menu bar.

The public file is a Developer ID signed, notarised disk image. The app does not update itself; download a new disk image when you want a newer version.

## Privacy

- Microphone audio is processed entirely on-device and discarded.
- The Mac app does not contact the network (in-app requests that are not local files are blocked). It does not check for updates by itself.
- There are no accounts, analytics, telemetry, or crash reporters.
- Local preferences store only sensitivity, login-item choice, and a sneeze count.

See [website/privacy.html](website/privacy.html).

## Build from source

Requires macOS 14+, Node.js 18+, and Xcode command line tools.

```bash
npm install
npm start
```

Local source builds are for development. They are not signed for other Macs.

### Public Mac release

You need an Apple Developer Program membership, a **Developer ID Application** certificate in Keychain, and notarytool credentials.

```bash
npm run release:mac:check
npm run release:mac
```

That command builds a universal app, signs it with Developer ID Application, notarises it with `xcrun notarytool`, staples the ticket, verifies Gatekeeper, writes `dist/ach000-mac.dmg`, and uploads that file to the GitHub release that [ach000.com](https://www.ach000.com) serves.

Website reinstalls only pick up a source fix after this command finishes and replaces `ach000-mac.dmg`. Do not distribute `npm run build` output. That path is local-only and may be ad-hoc signed.

## How sneeze detection works

ach000 prefers [YAMNet](https://www.tensorflow.org/hub/tutorials/yamnet) via MediaPipe, bundled with the app, and always runs a lightweight acoustic burst detector next to it. If the model cannot load, the acoustic detector still listens. It ignores a sound only when a cough is clearly stronger than a sneeze, waits a few seconds between blessings, and never writes audio to disk.

Classifier backends live under `src/detection/` behind a small `SneezeClassifying` contract so another on-device engine can be added later.
