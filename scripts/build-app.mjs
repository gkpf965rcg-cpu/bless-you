import * as esbuild from "esbuild";
import { cpSync, existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "website", "app", "assets");
const wasmSrc = join(root, "node_modules", "@mediapipe", "tasks-audio", "wasm");
const wasmDest = join(root, "website", "app", "wasm");

mkdirSync(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [join(root, "src", "app.js")],
  bundle: true,
  outfile: join(outDir, "app.js"),
  format: "iife",
  platform: "browser",
  target: ["es2020"],
  sourcemap: true,
  minify: false
});

if (existsSync(wasmSrc)) {
  mkdirSync(wasmDest, { recursive: true });
  cpSync(wasmSrc, wasmDest, { recursive: true });
}

const fontsSrc = join(root, "website", "fonts");
const fontsDest = join(root, "website", "app", "fonts");
if (existsSync(fontsSrc)) {
  mkdirSync(fontsDest, { recursive: true });
  cpSync(fontsSrc, fontsDest, { recursive: true });
}

const fetchModel = join(root, "scripts", "fetch-model.mjs");
if (existsSync(fetchModel)) {
  await import(fetchModel);
}

console.log("Built website/app/assets/app.js");
