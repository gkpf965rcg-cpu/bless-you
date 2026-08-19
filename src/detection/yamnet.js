import { sneezeScores } from "./classifying.js";

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

export async function createYamnetDetector(onResult, onError) {
  let AudioClassifier;
  let FilesetResolver;
  try {
    ({ AudioClassifier, FilesetResolver } = await import("@mediapipe/tasks-audio"));
  } catch (error) {
    return null;
  }

  const wasmBase = new URL("./wasm/", window.location.href).href;
  const modelPath = new URL("./models/yamnet.tflite", window.location.href).href;

  try {
    const modelProbe = await fetch(modelPath);
    if (!modelProbe.ok) return null;

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
          onError?.(error.message || String(error));
        }
      },
      close() {
        classifier.close?.();
      }
    };
  } catch {
    return null;
  }
}
