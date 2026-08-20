import { sneezeScores } from "./classifying.js";
import { scoresFromYamnetCategories, YAMNET_CATEGORY_ALLOWLIST } from "./decision.js";
import { appDirectoryUrl } from "../paths.js";

function assetUrl(relativePath) {
  return new URL(relativePath, appDirectoryUrl()).href;
}

async function readBytes(url) {
  try {
    const response = await fetch(url, { credentials: "same-origin" });
    if (response.ok) return new Uint8Array(await response.arrayBuffer());
    if (response.status) {
      throw new Error(`HTTP ${response.status}`);
    }
  } catch (error) {
    console.warn("fetch of YAMNet model failed; trying XHR", error?.message || error);
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "arraybuffer";
    xhr.onload = () => {
      if (xhr.status === 0 || xhr.status === 200) {
        resolve(new Uint8Array(xhr.response));
        return;
      }
      reject(new Error(`HTTP ${xhr.status}`));
    };
    xhr.onerror = () => reject(new Error("Could not read the YAMNet model"));
    xhr.send();
  });
}

async function createClassifier(AudioClassifier, fileset, modelBuffer, extraOptions) {
  return AudioClassifier.createFromOptions(fileset, {
    baseOptions: {
      modelAssetBuffer: modelBuffer
    },
    runningMode: "AUDIO_CLIPS",
    maxResults: 20,
    scoreThreshold: 0.03,
    ...extraOptions
  });
}

export async function createYamnetDetector(onResult, onError) {
  let AudioClassifier;
  let FilesetResolver;
  try {
    ({ AudioClassifier, FilesetResolver } = await import("@mediapipe/tasks-audio"));
  } catch (error) {
    console.warn("MediaPipe audio tasks are unavailable", error?.message || error);
    return null;
  }

  // MediaPipe joins `${wasmBase}/${filename}`, so the base must not end with `/`.
  const wasmBase = assetUrl("wasm").replace(/\/$/, "");
  const modelPath = assetUrl("models/yamnet.tflite");

  try {
    const modelBuffer = await readBytes(modelPath);
    if (!modelBuffer || modelBuffer.length < 100000) {
      console.warn("YAMNet model was missing or too small");
      return null;
    }

    const fileset = await FilesetResolver.forAudioTasks(wasmBase);
    let classifier;
    try {
      classifier = await createClassifier(AudioClassifier, fileset, modelBuffer, {
        categoryAllowlist: YAMNET_CATEGORY_ALLOWLIST
      });
    } catch (error) {
      console.warn("YAMNet allowlist failed; using full label set", error?.message || error);
      classifier = await createClassifier(AudioClassifier, fileset, modelBuffer, {
        maxResults: -1
      });
    }

    return {
      kind: "yamnet",
      classify(samples, sampleRate) {
        try {
          const results = classifier.classify(samples, sampleRate);
          let sneeze = 0;
          let cough = 0;
          for (const result of results || []) {
            const categories = result.classifications?.[0]?.categories || [];
            const scores = scoresFromYamnetCategories(categories);
            sneeze = Math.max(sneeze, scores.sneeze);
            cough = Math.max(cough, scores.cough);
          }
          if (sneeze > 0.03 || cough > 0.03) {
            const scores = sneezeScores(sneeze, cough);
            onResult(scores.sneeze, scores.cough);
          }
        } catch (error) {
          console.error("YAMNet classify failed", error?.message || error);
          onError?.(error.message || String(error));
        }
      },
      close() {
        classifier.close?.();
      }
    };
  } catch (error) {
    console.warn("YAMNet failed to initialise", error?.name || "", error?.message || error);
    return null;
  }
}
