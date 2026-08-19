import { AcousticDetector, resample } from "./acoustic.js";
import { createYamnetDetector } from "./yamnet.js";

const TARGET_RATE = 16000;
const WINDOW_SAMPLES = 16000;
const HOP_SAMPLES = 8000;

/** On-device sneeze classifier used on every platform. */
export class SneezePipeline {
  constructor({ onResult, onError }) {
    this.onResult = onResult;
    this.onError = onError;
    this.yamnet = null;
    this.acoustic = new AcousticDetector(onResult);
    this.buffer = new Float32Array(0);
    this.ready = false;
    this.initialized = false;
  }

  async start() {
    if (!this.initialized) {
      this.yamnet = await createYamnetDetector(this.onResult, this.onError);
      this.initialized = true;
    }
    this.ready = true;
    return this.yamnet ? "yamnet" : "acoustic";
  }

  push(samples, sampleRate) {
    if (!this.ready) return;
    const resampled = resample(samples, sampleRate, TARGET_RATE);

    if (this.yamnet) {
      const merged = new Float32Array(this.buffer.length + resampled.length);
      merged.set(this.buffer);
      merged.set(resampled, this.buffer.length);
      this.buffer = merged;
      while (this.buffer.length >= WINDOW_SAMPLES) {
        const window = this.buffer.subarray(0, WINDOW_SAMPLES);
        this.yamnet.classify(window, TARGET_RATE);
        this.buffer = this.buffer.slice(HOP_SAMPLES);
      }
      return;
    }

    this.acoustic.push(resampled, TARGET_RATE);
  }

  stop() {
    this.buffer = new Float32Array(0);
    this.acoustic.stop();
    this.ready = false;
  }
}
