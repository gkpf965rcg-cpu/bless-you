import * as esbuild from "esbuild";
import { mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const outDir = join(root, ".build");
const outfile = join(outDir, "test-detection.bundle.mjs");

mkdirSync(outDir, { recursive: true });

await esbuild.build({
  stdin: {
    contents: `
      export { shouldBless, sneezeThreshold, scoresFromYamnetCategories } from "./src/detection/decision.js";
      export { isBurstFrame } from "./src/detection/acoustic.js";
    `,
    resolveDir: root,
    sourcefile: "test-detection-entry.js"
  },
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile
});

const {
  shouldBless,
  sneezeThreshold,
  scoresFromYamnetCategories,
  isBurstFrame
} = await import(`${pathToFileURL(outfile).href}?t=${Date.now()}`);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(Math.abs(sneezeThreshold(0) - 0.66) < 1e-9, "picky threshold");
assert(Math.abs(sneezeThreshold(1) - 0.14) < 1e-9, "eager threshold");
assert(sneezeThreshold(0.55) < 0.4, "balanced threshold is reachable for a mid sneeze");

assert(shouldBless(0.45, 0.1, 0.55), "clear sneeze should bless");
assert(!shouldBless(0.1, 0.05, 0.55), "weak score should not bless at balanced");
assert(shouldBless(0.28, 0.3, 1), "fake achoo scored as a slightly stronger cough should still bless when eager");
assert(!shouldBless(0.2, 0.7, 1), "a real cough should not bless");

const yamnet = scoresFromYamnetCategories([
  { displayName: "Speech", score: 0.6 },
  { displayName: "Sneeze", score: 0.22 },
  { displayName: "Cough", score: 0.18 }
]);
assert(yamnet.sneeze >= 0.22, "sneeze score must not be dropped when speech is louder");
assert(yamnet.cough >= 0.18, "cough score is kept");

const gasp = scoresFromYamnetCategories([{ displayName: "Gasp", score: 0.4 }]);
assert(gasp.sneeze > 0.3, "gasp counts toward sneeze");

const blow = isBurstFrame(
  { rms: 0.12, zcr: 0.2, centroid: 3200, highRatio: 0.45, lowRatio: 0.2 },
  0.01,
  0.01
);
assert(blow, "broadband blow should count as a burst");

const vowel = isBurstFrame(
  { rms: 0.12, zcr: 0.03, centroid: 450, highRatio: 0.08, lowRatio: 0.7 },
  0.01,
  0.01
);
assert(!vowel, "steady voiced speech should not count as a sneeze burst");

const choo = isBurstFrame(
  { rms: 0.08, zcr: 0.16, centroid: 1800, highRatio: 0.28, lowRatio: 0.3 },
  0.01,
  0.02
);
assert(choo, "short choo burst should count");

console.log("test-detection: ok");
