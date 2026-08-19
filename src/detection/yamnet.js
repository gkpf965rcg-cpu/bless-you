import { sneezeScores } from "./classifying.js";
import { appDirectoryUrl } from "../paths.js";

function scoreFor(categories, pattern) {
  let best = 0;
  for (const category of categories) {
    const name = `${category.categoryName || ""} ${category.displayName || ""}`;
    if (pattern.test(name)) {
      best = Math.max(best, category.score || 0);
    }
  }
  return best;
}

function assetUrl(relativePath) {
  return new URL(relativePath, appDirectoryUrl()).href;
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
    const modelProbe = await fetch(modelPath, {
      credentials: "same-origin",
      signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(8000) : undefined
    });
    if (!modelProbe.ok) {
      console.warn("YAMNet model was not found", modelProbe.status);
      return null;
    }

    const fileset = await FilesetResolver.forAudioTasks(wasmBase);
    const classifier = await AudioClassifier.createFromOptions(fileset, {
      baseOptions: {
        modelAssetPath: modelPath
      },
      runningMode: "AUDIO_CLIPS",
      maxResults: 12,
      scoreThreshold: 0.05
    });

    return {
      kind: "yamnet",
      classify(samples, sampleRate) {
        try {
          const results = classifier.classify(samples, sampleRate);
          let sneeze = 0;
          let cough = 0;
          for (const result of results || []) {
            const categories = result.classifications?.[0]?.categories || [];
            sneeze = Math.max(sneeze, scoreFor(categories, /sneeze/i));
            cough = Math.max(cough, scoreFor(categories, /cough/i));
          }
          if (sneeze > 0.05 || cough > 0.05) {
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
