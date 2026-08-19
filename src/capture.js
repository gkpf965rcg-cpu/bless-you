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

export class MicCapture {
  constructor(onAudio) {
    this.onAudio = onAudio;
    this.context = null;
    this.stream = null;
    this.node = null;
    this.source = null;
    this.silent = null;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: false,
        autoGainControl: false
      },
      video: false
    });

    this.context = new AudioContext();
    if (this.context.state === "suspended") {
      await this.context.resume();
    }

    this.source = this.context.createMediaStreamSource(this.stream);
    this.silent = this.context.createGain();
    this.silent.gain.value = 0;

    if (this.context.audioWorklet) {
      const blob = new Blob([WORKLET_SOURCE], { type: "application/javascript" });
      const url = URL.createObjectURL(blob);
      await this.context.audioWorklet.addModule(url);
      URL.revokeObjectURL(url);
      this.node = new AudioWorkletNode(this.context, "capture-processor");
      this.node.port.onmessage = (event) => {
        this.onAudio(event.data, this.context.sampleRate);
      };
    } else {
      const processor = this.context.createScriptProcessor(4096, 1, 1);
      processor.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        this.onAudio(new Float32Array(input), this.context.sampleRate);
      };
      this.node = processor;
    }

    this.source.connect(this.node);
    this.node.connect(this.silent);
    this.silent.connect(this.context.destination);
  }

  async stop() {
    this.node?.disconnect();
    this.source?.disconnect();
    this.silent?.disconnect();
    this.stream?.getTracks().forEach((track) => track.stop());
    if (this.context && this.context.state !== "closed") {
      await this.context.close();
    }
    this.context = null;
    this.stream = null;
    this.node = null;
    this.source = null;
    this.silent = null;
  }
}
