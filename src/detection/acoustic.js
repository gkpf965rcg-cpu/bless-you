import { sneezeScores } from "./classifying.js";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function resample(input, fromRate, toRate) {
  if (fromRate === toRate) return input;
  const ratio = fromRate / toRate;
  const length = Math.max(1, Math.round(input.length / ratio));
  const output = new Float32Array(length);
  for (let i = 0; i < length; i += 1) {
    const src = i * ratio;
    const i0 = Math.floor(src);
    const i1 = Math.min(i0 + 1, input.length - 1);
    const frac = src - i0;
    output[i] = input[i0] * (1 - frac) + input[i1] * frac;
  }
  return output;
}

function fftMagnitudes(time) {
  const n = time.length;
  const real = new Float32Array(n);
  const imag = new Float32Array(n);
  real.set(time);

  for (let i = 1, j = 0; i < n; i += 1) {
    let bit = n >> 1;
    while (j & bit) {
      j ^= bit;
      bit >>= 1;
    }
    j ^= bit;
    if (i < j) {
      const tmpR = real[i];
      real[i] = real[j];
      real[j] = tmpR;
      const tmpI = imag[i];
      imag[i] = imag[j];
      imag[j] = tmpI;
    }
  }

  for (let size = 2; size <= n; size <<= 1) {
    const half = size >> 1;
    const step = (2 * Math.PI) / size;
    for (let i = 0; i < n; i += size) {
      for (let k = 0; k < half; k += 1) {
        const angle = step * k;
        const wr = Math.cos(angle);
        const wi = -Math.sin(angle);
        const evenR = real[i + k];
        const evenI = imag[i + k];
        const oddR = real[i + k + half];
        const oddI = imag[i + k + half];
        const tR = wr * oddR - wi * oddI;
        const tI = wr * oddI + wi * oddR;
        real[i + k] = evenR + tR;
        imag[i + k] = evenI + tI;
        real[i + k + half] = evenR - tR;
        imag[i + k + half] = evenI - tI;
      }
    }
  }

  const mags = new Float32Array(n / 2);
  for (let i = 0; i < mags.length; i += 1) {
    mags[i] = Math.hypot(real[i], imag[i]) / n;
  }
  return mags;
}

function frameFeatures(frame, sampleRate) {
  let sumSq = 0;
  let zcr = 0;
  for (let i = 0; i < frame.length; i += 1) {
    sumSq += frame[i] * frame[i];
    if (i > 0 && frame[i - 1] * frame[i] < 0) zcr += 1;
  }
  const rms = Math.sqrt(sumSq / frame.length);

  const windowed = new Float32Array(frame.length);
  for (let i = 0; i < frame.length; i += 1) {
    const hann = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (frame.length - 1)));
    windowed[i] = frame[i] * hann;
  }
  const mags = fftMagnitudes(windowed);
  const binHz = sampleRate / frame.length;

  let total = 0;
  let weighted = 0;
  let high = 0;
  let low = 0;
  for (let i = 1; i < mags.length; i += 1) {
    const hz = i * binHz;
    const mag = mags[i];
    total += mag;
    weighted += mag * hz;
    if (hz >= 2000 && hz <= 8000) high += mag;
    if (hz < 1500) low += mag;
  }

  return {
    rms,
    zcr: zcr / frame.length,
    centroid: total > 0 ? weighted / total : 0,
    highRatio: total > 0 ? high / total : 0,
    lowRatio: total > 0 ? low / total : 0
  };
}

export function isBurstFrame(features, noiseRms, prevRms = 0) {
  const loud = features.rms > Math.max(noiseRms * 4.2, 0.016);
  const bright = features.highRatio > 0.22 && features.centroid > 1050;
  const fricative =
    features.zcr > 0.1 &&
    features.highRatio > 0.18 &&
    features.rms > Math.max(noiseRms * 3.4, 0.014);
  const sharp =
    prevRms > 0 &&
    features.rms > prevRms * 3 &&
    features.rms > Math.max(noiseRms * 3.2, 0.014) &&
    (features.centroid > 900 || features.zcr > 0.08 || features.highRatio > 0.16);
  return (loud && (bright || fricative)) || sharp;
}

export class AcousticDetector {
  constructor(onResult) {
    this.onResult = onResult;
    this.sampleRate = 16000;
    this.frameSize = 1024;
    this.pending = new Float32Array(0);
    this.noiseRms = 0.01;
    this.prevRms = 0.01;
    this.event = null;
  }

  push(samples, sampleRate) {
    const resampled = resample(samples, sampleRate, this.sampleRate);
    const merged = new Float32Array(this.pending.length + resampled.length);
    merged.set(this.pending);
    merged.set(resampled, this.pending.length);
    let offset = 0;
    while (offset + this.frameSize <= merged.length) {
      this._consumeFrame(merged.subarray(offset, offset + this.frameSize));
      offset += this.frameSize / 2;
    }
    this.pending = merged.slice(offset);
  }

  _consumeFrame(frame) {
    const features = frameFeatures(frame, this.sampleRate);

    if (features.rms < this.noiseRms * 1.8) {
      this.noiseRms = this.noiseRms * 0.995 + features.rms * 0.005;
    }

    const burst = isBurstFrame(features, this.noiseRms, this.prevRms);
    this.prevRms = features.rms * 0.45 + this.prevRms * 0.55;

    if (!this.event && burst) {
      this.event = { frames: [features], startedQuiet: 0 };
      return;
    }

    if (this.event) {
      this.event.frames.push(features);
      if (!burst && features.rms < this.noiseRms * 2.2) {
        this.event.startedQuiet += 1;
      } else {
        this.event.startedQuiet = 0;
      }

      const duration = this.event.frames.length * (this.frameSize / 2 / this.sampleRate);
      if (this.event.startedQuiet >= 4 || duration > 0.9) {
        this._finishEvent();
      }
    }
  }

  _finishEvent() {
    const frames = this.event.frames;
    this.event = null;
    if (frames.length < 2) return;

    const duration = frames.length * (this.frameSize / 2 / this.sampleRate);
    let peakIndex = 0;
    for (let i = 1; i < frames.length; i += 1) {
      if (frames[i].rms > frames[peakIndex].rms) peakIndex = i;
    }
    const peak = frames[peakIndex];
    const attack = peakIndex * (this.frameSize / 2 / this.sampleRate);

    const durationScore = duration >= 0.08 && duration <= 0.85 ? 1 : duration < 0.08 ? duration / 0.08 : clamp(1 - (duration - 0.85) / 0.3, 0, 1);
    const attackScore = attack <= 0.16 ? 1 : clamp(1 - (attack - 0.16) / 0.18, 0, 1);
    const centroidScore = peak.centroid >= 1100 && peak.centroid <= 7000 ? 1 : peak.centroid >= 700 ? 0.55 : 0.15;
    const highScore = clamp((peak.highRatio - 0.18) / 0.35, 0, 1);
    const zcrScore = clamp((peak.zcr - 0.06) / 0.14, 0, 1);
    const coughHint = peak.lowRatio > 0.62 && peak.centroid < 1500 && peak.zcr < 0.08 ? 0.75 : peak.lowRatio * 0.3;

    const sneeze = clamp(
      durationScore * 0.24 + attackScore * 0.16 + centroidScore * 0.22 + highScore * 0.22 + zcrScore * 0.16,
      0,
      1
    );
    const cough = clamp(coughHint + (duration > 0.55 ? 0.15 : 0), 0, 1);

    if (sneeze > 0.05 || cough > 0.05) {
      const scores = sneezeScores(sneeze, cough);
      this.onResult(scores.sneeze, scores.cough);
    }
  }

  stop() {
    this.pending = new Float32Array(0);
    this.event = null;
    this.prevRms = 0.01;
  }
}
