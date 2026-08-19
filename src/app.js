import { MicCapture } from "./capture.js";
import { SneezePipeline } from "./detection/pipeline.js";
import {
  applyRuntimeClass,
  deviceNoun,
  getRuntime,
  microphoneButtonLabel,
  microphoneHelp,
  openMicrophoneSettings,
  supportsAutoStart,
  supportsNativeQuit
} from "./platform.js";
import { speakBlessYou, unlockSpeech, warmUpVoices } from "./speech/speaking.js";

const KEYS = {
  sensitivity: "sensitivity",
  sneezeCount: "sneezeCount",
  micKnown: "micKnown"
};

const MIC_EXPLAIN =
  "ach000 listens with the microphone so it can hear a sneeze and say bless you. Audio stays on this device and is never recorded, stored, or uploaded.";

const COOLDOWN = 3.0;
const DEFAULT_SENSITIVITY = 0.55;

const state = {
  isListening: false,
  permissionDenied: false,
  statusText: "Ready",
  lastSneezeAt: null,
  sneezeCount: Number(localStorage.getItem(KEYS.sneezeCount) || 0),
  errorMessage: null,
  sensitivity: Number(localStorage.getItem(KEYS.sensitivity) ?? DEFAULT_SENSITIVITY),
  lastTrigger: 0,
  deviceChangeHandler: null,
  starting: false
};

const pipeline = new SneezePipeline({
  onResult: handleClassification,
  onError: (message) => {
    console.error("Classifier error", message);
    state.errorMessage = "The sneeze detector hit a problem. Try turning listening off and on.";
    state.statusText = "Classifier error";
    render();
  }
});

const capture = new MicCapture((samples, sampleRate) => {
  pipeline.push(samples, sampleRate);
});

capture.onCaptureError = (error) => {
  console.warn("Microphone capture interrupted", error?.message || error);
  if (!state.isListening) return;
  state.errorMessage = error?.message || "The microphone stopped.";
  state.statusText = "Microphone stopped";
  stop();
};

let wakeLock = null;
let startGeneration = 0;
const els = {};

function isWeb() {
  return getRuntime().shell === "web";
}

function threshold() {
  return 0.78 - state.sensitivity * 0.52;
}

function sensitivityLabel() {
  if (state.sensitivity < 0.35) return "Picky";
  if (state.sensitivity > 0.7) return "Eager";
  return "Balanced";
}

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function handleClassification(sneeze, cough) {
  if (!state.isListening) return;
  const now = Date.now() / 1000;
  if (now - state.lastTrigger < COOLDOWN) return;
  if (sneeze < threshold()) return;
  if (sneeze < cough) return;

  state.lastTrigger = now;
  state.lastSneezeAt = new Date();
  state.sneezeCount += 1;
  localStorage.setItem(KEYS.sneezeCount, String(state.sneezeCount));
  state.statusText = "Bless you";
  speakBlessYou();
  render();

  window.setTimeout(() => {
    if (state.isListening && state.statusText === "Bless you") {
      state.statusText = "Listening for sneezes";
      render();
    }
  }, 2200);
}

async function requestWakeLock() {
  try {
    if (document.visibilityState === "visible" && navigator.wakeLock) {
      wakeLock = await navigator.wakeLock.request("screen");
      wakeLock.addEventListener("release", () => {
        wakeLock = null;
      });
    }
  } catch {
    wakeLock = null;
  }
}

async function releaseWakeLock() {
  try {
    await wakeLock?.release();
  } catch {
    // Ignore.
  }
  wakeLock = null;
}

async function microphoneNeedsPrompt() {
  if (localStorage.getItem(KEYS.micKnown) === "1") return false;
  try {
    const status = await navigator.permissions.query({ name: "microphone" });
    return status.state === "prompt";
  } catch {
    return true;
  }
}

async function explainMicrophone() {
  if (window.blessyou?.explainMicrophone) {
    return window.blessyou.explainMicrophone();
  }
  return window.confirm(`${MIC_EXPLAIN}\n\nContinue?`);
}

function describeListenFailure(error) {
  const name = error?.name || "";
  const message = error?.message || "";
  const denied =
    name === "NotAllowedError" ||
    name === "PermissionDeniedError" ||
    name === "SecurityError" ||
    /permission|denied|not allowed/i.test(message);

  if (denied) {
    return {
      denied: true,
      statusText: "Microphone blocked",
      errorMessage: isWeb() ? "Microphone permission was denied." : null
    };
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return { denied: false, statusText: "No microphone", errorMessage: "No microphone was found." };
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return {
      denied: false,
      statusText: "Microphone busy",
      errorMessage: "The microphone is in use by another app."
    };
  }
  if (name === "NotSupportedError") {
    return {
      denied: true,
      statusText: "Microphone blocked",
      errorMessage: message || "This browser cannot access a microphone."
    };
  }
  if (name === "AudioContextSuspendedError") {
    return {
      denied: false,
      statusText: "Click to listen",
      errorMessage: "Click Listening so the browser can start the microphone."
    };
  }
  if (name === "AbortError") {
    return {
      denied: false,
      statusText: "Could not start microphone",
      errorMessage: "Microphone access was interrupted."
    };
  }
  return {
    denied: false,
    statusText: "Could not start microphone",
    errorMessage: "Could not start the microphone."
  };
}

async function start() {
  const generation = ++startGeneration;
  state.errorMessage = null;
  state.starting = true;
  state.statusText = "Starting";
  render();

  if (!window.isSecureContext) {
    state.permissionDenied = true;
    state.starting = false;
    state.statusText = "Microphone blocked";
    state.errorMessage = "This page needs HTTPS to use the microphone.";
    console.error("Microphone requires a secure context");
    render();
    return;
  }

  if (!navigator.mediaDevices?.getUserMedia) {
    state.permissionDenied = true;
    state.starting = false;
    state.statusText = "Microphone blocked";
    state.errorMessage = "This browser cannot access a microphone.";
    console.error("navigator.mediaDevices.getUserMedia is unavailable");
    render();
    return;
  }

  // Keep the Mac app's pre-prompt. Browsers must not await extra UI here,
  // or getUserMedia / AudioContext lose the user gesture.
  if (!isWeb() && (await microphoneNeedsPrompt())) {
    const allowed = await explainMicrophone();
    if (!allowed) {
      state.isListening = false;
      state.starting = false;
      state.statusText = "Paused";
      render();
      return;
    }
  }

  try {
    if (isWeb()) {
      unlockSpeech();
      const detector = pipeline.start();
      await capture.start();
      if (generation !== startGeneration) {
        pipeline.stop();
        await capture.stop();
        state.starting = false;
        return;
      }
      localStorage.setItem(KEYS.micKnown, "1");
      state.permissionDenied = false;
      state.isListening = true;
      state.starting = false;
      state.statusText = "Listening for sneezes";
      render();
      const kind = await detector;
      if (generation !== startGeneration) return;
      if (kind !== "yamnet") {
        console.warn("YAMNet did not load; using on-device acoustic detection");
      }
      await requestWakeLock();
      return;
    }

    await pipeline.start();
    await capture.start();
    if (generation !== startGeneration) {
      pipeline.stop();
      await capture.stop();
      state.starting = false;
      return;
    }
    localStorage.setItem(KEYS.micKnown, "1");
    state.permissionDenied = false;
    state.isListening = true;
    state.starting = false;
    state.statusText = "Listening for sneezes";
    watchDevices();
    await requestWakeLock();
  } catch (error) {
    console.error("Could not start listening", error?.name || "", error?.message || error);
    const failure = describeListenFailure(error);
    state.isListening = false;
    state.starting = false;
    state.permissionDenied = failure.denied;
    state.statusText = failure.statusText;
    state.errorMessage = failure.errorMessage;
    if (failure.denied) {
      localStorage.setItem(KEYS.micKnown, "1");
    }
    pipeline.stop();
    await capture.stop();
  }
  render();
}

async function stop() {
  startGeneration += 1;
  unwatchDevices();
  await capture.stop();
  pipeline.stop();
  await releaseWakeLock();
  state.isListening = false;
  state.starting = false;
  state.statusText = "Paused";
  render();
}

function watchDevices() {
  if (!navigator.mediaDevices?.addEventListener || state.deviceChangeHandler) return;
  state.deviceChangeHandler = async () => {
    if (!state.isListening) return;
    await stop();
    await start();
  };
  navigator.mediaDevices.addEventListener("devicechange", state.deviceChangeHandler);
}

function unwatchDevices() {
  if (state.deviceChangeHandler) {
    navigator.mediaDevices.removeEventListener("devicechange", state.deviceChangeHandler);
    state.deviceChangeHandler = null;
  }
}

function blessNow() {
  speakBlessYou();
  state.lastTrigger = Date.now() / 1000;
}

function quit() {
  stop();
  if (window.blessyou?.quit) {
    window.blessyou.quit();
    return;
  }
  window.close();
}

function render() {
  const { os } = getRuntime();
  els.status.textContent = state.statusText;
  els.listening.checked = state.isListening || state.starting;
  els.listeningLabel.textContent = state.isListening || state.starting ? "Listening" : "Not listening";
  els.sensitivity.value = String(state.sensitivity);
  els.sensLabel.textContent = sensitivityLabel();
  els.count.textContent =
    state.sneezeCount === 1 ? "1 sneeze blessed" : `${state.sneezeCount} sneezes blessed`;
  els.last.hidden = !state.lastSneezeAt;
  if (state.lastSneezeAt) {
    els.last.textContent = `Last sneeze ${formatTime(state.lastSneezeAt)}`;
  }
  els.privacy.textContent = `Audio never leaves this ${deviceNoun(os)}.`;
  els.error.hidden = !state.errorMessage;
  els.error.textContent = state.errorMessage || "";
  els.permission.hidden = !state.permissionDenied;
  els.permissionText.textContent = microphoneHelp(os);
  els.micButton.textContent = microphoneButtonLabel(os);
  els.micButton.hidden = isWeb();
  els.loginRow.hidden = !supportsAutoStart();
  els.quit.hidden = !supportsNativeQuit() && !window.blessyou;
  els.androidNote.hidden = !(os === "android" || os === "chromeos");
}

async function init() {
  applyRuntimeClass();
  warmUpVoices();

  els.status = document.getElementById("status");
  els.listening = document.getElementById("listening");
  els.listeningLabel = document.getElementById("listening-label");
  els.sensitivity = document.getElementById("sensitivity");
  els.sensLabel = document.getElementById("sens-label");
  els.count = document.getElementById("count");
  els.last = document.getElementById("last");
  els.privacy = document.getElementById("privacy");
  els.error = document.getElementById("error");
  els.permission = document.getElementById("permission");
  els.permissionText = document.getElementById("permission-text");
  els.micButton = document.getElementById("mic-settings");
  els.loginRow = document.getElementById("login-row");
  els.login = document.getElementById("login");
  els.quit = document.getElementById("quit");
  els.androidNote = document.getElementById("android-note");

  els.listening.addEventListener("change", () => {
    if (els.listening.checked) start();
    else stop();
  });
  els.sensitivity.addEventListener("input", () => {
    state.sensitivity = Number(els.sensitivity.value);
    localStorage.setItem(KEYS.sensitivity, String(state.sensitivity));
    els.sensLabel.textContent = sensitivityLabel();
  });
  document.getElementById("bless").addEventListener("click", blessNow);
  els.quit.addEventListener("click", quit);
  els.micButton.addEventListener("click", () => {
    openMicrophoneSettings();
  });

  if (supportsAutoStart()) {
    const enabled = await window.blessyou.getAutoStart();
    els.login.checked = enabled;
    els.login.addEventListener("change", async () => {
      const ok = await window.blessyou.setAutoStart(els.login.checked);
      if (!ok) {
        els.login.checked = await window.blessyou.getAutoStart();
      }
    });
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && state.isListening) {
      requestWakeLock();
      if (isWeb()) {
        capture.resume().catch((error) => {
          console.warn("Could not resume AudioContext", error?.message || error);
        });
      }
    }
  });

  render();

  // The Mac app starts listening on launch. Browsers block AudioContext /
  // getUserMedia without a user gesture, so the website waits for the toggle.
  if (!isWeb()) {
    window.setTimeout(() => {
      if (!state.isListening && !state.permissionDenied) start();
    }, 400);
  }

  if ("serviceWorker" in navigator && isWeb()) {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.warn("Service worker was not registered", error?.message || error);
    });
  }
}

init();
