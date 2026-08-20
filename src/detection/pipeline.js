import { AcousticDetector, resample } from "./acoustic.js";
import { createYamnetDetector } from "./yamnet.js";

const TARGET_RATE = 16000;
const WINDOW_SAMPLES = 16000;
const HOP_SAMPLES = 4000;
const YAMNET_TIMEOUT_MS = 12000;

function withTimeout(promise, ms, label) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`${label} timed out`)), ms);
    promise.then(
      (value) => {
        clearTimeout(id);
        resolve(value);
      },
      (error) => {
        clearTimeout(id);
        reject(error);
      }
    );
  });
}

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
    this.ready = true;
    if (!this.initialized) {
      try {
        this.yamnet = await withTimeout(
          createYamnetDetector(this.onResult, this.onError),
          YAMNET_TIMEOUT_MS,
          "YAMNet"
        );
      } catch (error) {
        console.warn("YAMNet unavailable; using acoustic detection", error?.message || error);
        this.yamnet = null;
      }
      this.initialized = true;
    }
    return this.yamnet ? "yamnet" : "acoustic";
  }

  push(samples, sampleRate) {
    if (!this.ready) return;
    const resampled = resample(samples, sampleRate, TARGET_RATE);

    this.acoustic.push(resampled, TARGET_RATE);

    if (!this.yamnet) return;

    const merged = new Float32Array(this.buffer.length + resampled.length);
    merged.set(this.buffer);
    merged.set(resampled, this.buffer.length);
    this.buffer = merged;
    while (this.buffer.length >= WINDOW_SAMPLES) {
      const window = this.buffer.subarray(0, WINDOW_SAMPLES);
      this.yamnet.classify(new Float32Array(window), TARGET_RATE);
      this.buffer = this.buffer.slice(HOP_SAMPLES);
    }
  }

  stop() {
    this.buffer = new Float32Array(0);
    this.acoustic.stop();
    this.ready = false;
  }
}
