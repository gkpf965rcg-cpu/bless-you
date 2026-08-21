import * as esbuild from "esbuild";
import { mkdirSync } from "fs";
import { join } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const outDir = join(root, ".build");
const outfile = join(outDir, "test-playlist.bundle.mjs");

mkdirSync(outDir, { recursive: true });

await esbuild.build({
  stdin: {
    contents: `export { createClipPlaylist, shuffleCycle } from "./src/speech/playlist.js";`,
    resolveDir: root,
    sourcefile: "test-playlist-entry.js"
  },
  bundle: true,
  format: "esm",
  platform: "neutral",
  outfile
});

const { createClipPlaylist, shuffleCycle } = await import(
  `${pathToFileURL(outfile).href}?t=${Date.now()}`
);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const clips = ["bless-you-1.wav", "bless-you-2.wav", "bless-you-3.wav", "bless-you-4.wav"];
const playlist = createClipPlaylist(clips);

let previousLast = null;
for (let cycle = 0; cycle < 200; cycle += 1) {
  const order = [];
  for (let i = 0; i < clips.length; i += 1) {
    order.push(playlist.next());
  }
  assert(new Set(order).size === clips.length, `cycle ${cycle} did not contain every clip: ${order}`);
  if (previousLast != null) {
    assert(order[0] !== previousLast, `cycle ${cycle} started with previous last clip ${previousLast}`);
  }
  previousLast = order[order.length - 1];
}

for (const last of clips) {
  const next = shuffleCycle(clips, last);
  assert(next[0] !== last, `reshuffle started with previous last clip ${last}`);
  assert(new Set(next).size === clips.length, `reshuffle dropped a clip: ${next}`);
}

console.log("test-playlist: ok");
