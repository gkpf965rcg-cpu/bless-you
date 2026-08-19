/**
 * On-device sneeze classification contract.
 *
 * Implementations must keep microphone audio in memory, classify locally,
 * and return only sneeze/cough confidence scores. Platform-specific models
 * can sit behind the same methods without changing the rest of the app.
 *
 * @typedef {object} SneezeScores
 * @property {number} sneeze
 * @property {number} cough
 *
 * @typedef {object} SneezeClassifying
 * @property {() => Promise<string>} start
 * @property {(samples: Float32Array, sampleRate: number) => void} push
 * @property {() => void} stop
 */

export function sneezeScores(sneeze = 0, cough = 0) {
  return { sneeze, cough };
}
