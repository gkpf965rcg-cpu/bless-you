import { createWriteStream, existsSync, mkdirSync, statSync } from "fs";
import https from "https";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const destDir = join(root, "website", "app", "models");
const dest = join(destDir, "yamnet.tflite");
const url = "https://storage.googleapis.com/mediapipe-models/audio_classifier/yamnet/float32/1/yamnet.tflite";

function get(location, redirects = 0) {
  return new Promise((resolve, reject) => {
    if (redirects > 8) {
      reject(new Error("Too many redirects"));
      return;
    }
    const client = location.startsWith("https://") ? https : null;
    if (!client) {
      reject(new Error(`Refusing non-HTTPS download: ${location}`));
      return;
    }
    client.get(location, (response) => {
      const status = response.statusCode || 0;
      if (status >= 300 && status < 400 && response.headers.location) {
        const next = new URL(response.headers.location, location).href;
        response.resume();
        get(next, redirects + 1).then(resolve, reject);
        return;
      }
      if (status !== 200) {
        reject(new Error(`HTTP ${status}`));
        response.resume();
        return;
      }
      resolve(response);
    }).on("error", reject);
  });
}

if (existsSync(dest) && statSync(dest).size > 100000) {
  console.log("YAMNet model already present");
} else {
  mkdirSync(destDir, { recursive: true });
  try {
    const response = await get(url);
    await new Promise((resolve, reject) => {
      const file = createWriteStream(dest);
      response.pipe(file);
      file.on("finish", () => file.close(resolve));
      file.on("error", reject);
    });
    console.log(`Saved ${dest}`);
  } catch (error) {
    console.warn(`Could not download YAMNet (${error.message}). Acoustic detection will be used.`);
  }
}
