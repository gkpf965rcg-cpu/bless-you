import { appDirectoryUrl } from "./paths.js";

const WORKLET_SOURCE = `
class CaptureProcessor extends AudioWorkletProcessor {
  process(inputs) {
    const channel = inputs[0] && inputs[0][0];
    if (channel && channel.length) {
      this.port.postMessage(channel.slice());
    }
    return true;
  }
}
registerProcessor("capture-processor", CaptureProcessor);
`;

const PREFERRED_AUDIO = {
  echoCancellation: { ideal: true },
  noiseSuppression: { ideal: false },
  autoGainControl: { ideal: false },
  channelCount: { ideal: 1 }
};

function audioContextConstructor() {
  return window.AudioContext || window.webkitAudioContext;
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const id = window.setTimeout(() => resolve("timeout"), ms);
    promise.then(
      (value) => {
        window.clearTimeout(id);
        resolve(value);
      },
      (error) => {
        window.clearTimeout(id);
        reject(error);
      }
    );
  });
}

export class MicCapture {
  constructor(onAudio) {
    this.onAudio = onAudio;
    this.context = null;
    this.stream = null;
    this.node = null;
    this.source = null;
    this.silent = null;
    this.workletObjectUrl = null;
    this._onStateChange = null;
    this._onTrackEnded = null;
    this._frameLogged = false;
    this.onCaptureError = null;
  }

  async start() {
    if (this.context || this.stream) {
      await this.stop();
    }

    if (!window.isSecureContext) {
      const error = new Error("Microphone access needs HTTPS.");
      error.name = "SecurityError";
      throw error;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      const error = new Error("This browser cannot access a microphone.");
      error.name = "NotSupportedError";
      throw error;
    }

    const AudioCtx = audioContextConstructor();
    if (!AudioCtx) {
      const error = new Error("This browser cannot process microphone audio.");
      error.name = "NotSupportedError";
      throw error;
    }

    // Create and resume the context in the same turn as the user click.
    // Awaiting getUserMedia first would lose the gesture in Safari.
    this.context = new AudioCtx();
    const resumeAttempt = this.context.resume();

    try {
      this.stream = await this._openMicrophone();
    } catch (error) {
      await this.stop();
      throw error;
    }

    try {
      this.source = this.context.createMediaStreamSource(this.stream);
      this.silent = this.context.createGain();
      // Safari may skip processing a graph whose gain is exactly 0.
      this.silent.gain.value = 0.00001;

      await this._connectProcessor();
      this.source.connect(this.node);
      this.node.connect(this.silent);
      this.silent.connect(this.context.destination);

      try {
        await withTimeout(resumeAttempt, 1500);
      } catch (error) {
        console.warn("AudioContext.resume() failed", error?.name || "", error?.message || error);
      }

      if (this.context.state === "suspended") {
        try {
          await this.context.resume();
        } catch (error) {
          console.warn("AudioContext.resume() retry failed", error?.name || "", error?.message || error);
        }
      }

      if (this.context.state === "suspended") {
        const error = new Error("Click Listening so the browser can start the microphone.");
        error.name = "AudioContextSuspendedError";
        throw error;
      }

      this._listenForInterruptions();
    } catch (error) {
      await this.stop();
      throw error;
    }
  }

  async resume() {
    if (!this.context || this.context.state === "closed") return;
    if (this.context.state === "suspended") {
      await this.context.resume();
    }
  }

  async stop() {
    this._unlistenForInterruptions();
    try {
      this.node?.disconnect();
    } catch {
      // Ignore.
    }
    try {
      this.source?.disconnect();
    } catch {
      // Ignore.
    }
    try {
      this.silent?.disconnect();
    } catch {
      // Ignore.
    }
    this.stream?.getTracks().forEach((track) => track.stop());
    if (this.workletObjectUrl) {
      URL.revokeObjectURL(this.workletObjectUrl);
    }
    if (this.context && this.context.state !== "closed") {
      try {
        await this.context.close();
      } catch {
        // Ignore.
      }
    }
    this.context = null;
    this.stream = null;
    this.node = null;
    this.source = null;
    this.silent = null;
    this.workletObjectUrl = null;
    this._frameLogged = false;
  }

  async _openMicrophone() {
    try {
      return await navigator.mediaDevices.getUserMedia({
        audio: PREFERRED_AUDIO,
        video: false
      });
    } catch (error) {
      if (error?.name === "OverconstrainedError" || error?.name === "ConstraintNotSatisfiedError") {
        console.warn("Microphone constraints not supported; retrying with defaults");
        return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      }
      throw error;
    }
  }

  async _connectProcessor() {
    const deliver = (samples) => {
      if (!this.context) return;
      if (!this._frameLogged) {
        this._frameLogged = true;
        console.info("Microphone capture is receiving audio");
      }
      this.onAudio(samples, this.context.sampleRate);
    };

    if (this.context.audioWorklet) {
      try {
        await Promise.race([
          this._loadWorkletModule(),
          new Promise((_, reject) => {
            window.setTimeout(() => reject(new Error("AudioWorklet addModule timed out")), 4000);
          })
        ]);
        this.node = new AudioWorkletNode(this.context, "capture-processor");
        this.node.port.onmessage = (event) => {
          deliver(event.data);
        };
        return;
      } catch (error) {
        console.warn("AudioWorklet failed; using script processor", error?.message || error);
      }
    }

    const processor = this.context.createScriptProcessor?.(4096, 1, 1);
    if (!processor) {
      const error = new Error("This browser cannot process microphone audio.");
      error.name = "NotSupportedError";
      throw error;
    }
    processor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      deliver(new Float32Array(input));
    };
    this.node = processor;
  }

  async _loadWorkletModule() {
    const blob = new Blob([WORKLET_SOURCE], { type: "application/javascript" });
    const blobUrl = URL.createObjectURL(blob);
    try {
      await this.context.audioWorklet.addModule(blobUrl);
      this.workletObjectUrl = blobUrl;
      return;
    } catch (error) {
      URL.revokeObjectURL(blobUrl);
      console.warn("Blob AudioWorklet module failed", error?.message || error);
    }

    const fileUrl = new URL("assets/capture-processor.js", appDirectoryUrl()).href;
    await this.context.audioWorklet.addModule(fileUrl);
  }

  _listenForInterruptions() {
    this._onStateChange = () => {
      if (this.context?.state === "suspended") {
        console.warn("AudioContext was suspended while listening");
      }
    };
    this.context?.addEventListener("statechange", this._onStateChange);

    const track = this.stream?.getAudioTracks?.()[0];
    if (!track) return;
    this._onTrackEnded = () => {
      console.warn("Microphone track ended");
      this.onCaptureError?.(new Error("The microphone was disconnected."));
    };
    track.addEventListener("ended", this._onTrackEnded);
  }

  _unlistenForInterruptions() {
    if (this._onStateChange && this.context) {
      this.context.removeEventListener("statechange", this._onStateChange);
    }
    const track = this.stream?.getAudioTracks?.()[0];
    if (this._onTrackEnded && track) {
      track.removeEventListener("ended", this._onTrackEnded);
    }
    this._onStateChange = null;
    this._onTrackEnded = null;
  }
}
