/**
 * BlessYouSpeaking contract: speakBlessYou() plays the blessing locally.
 * macOS uses the Web Speech API (on-device voices). A future Windows port
 * can call a native TTS engine through the same function names.
 */
const UTTERANCE = "Bless you.";

// Chrome may garbage-collect the utterance if nothing in JS holds it.
let currentUtterance = null;
let speakTimer = 0;

function preferredVoice() {
  const voices = speechSynthesis.getVoices?.() || [];
  const preferred = [
    "Daniel",
    "Kate",
    "Serena",
    "Samantha",
    "Google UK English Male",
    "Google UK English Female",
    "Microsoft George",
    "Microsoft Hazel"
  ];

  for (const name of preferred) {
    const match = voices.find((voice) => voice.name.includes(name));
    if (match) return match;
  }

  return (
    voices.find((voice) => voice.lang?.toLowerCase().startsWith("en-gb")) ||
    voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) ||
    null
  );
}

function queueUtterance() {
  const utterance = new SpeechSynthesisUtterance(UTTERANCE);
  utterance.rate = 0.93;
  utterance.pitch = 1.04;
  const voice = preferredVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  } else {
    utterance.lang = "en-GB";
  }
  currentUtterance = utterance;
  try {
    speechSynthesis.resume();
  } catch {
    // Ignore.
  }
  speechSynthesis.speak(utterance);
}

function speakInBrowser() {
  if (!("speechSynthesis" in window)) return false;

  window.clearTimeout(speakTimer);

  // Chrome drops speak() when it runs in the same turn as cancel().
  // Only interrupt a blessing we started — a stuck speaking flag
  // should not delay the first click past the user gesture.
  if (currentUtterance && (speechSynthesis.speaking || speechSynthesis.pending)) {
    speechSynthesis.cancel();
    speakTimer = window.setTimeout(queueUtterance, 50);
    return true;
  }

  queueUtterance();
  return true;
}

export function speakBlessYou() {
  // Native TTS is Linux-only. Speak in this turn everywhere else so a
  // click still counts as a user gesture (Safari / Chrome / Mac app).
  if (window.blessyou?.platform === "linux" && window.blessyou.speak) {
    window.blessyou.speak(UTTERANCE);
    return;
  }
  if (!speakInBrowser() && window.blessyou?.speak) {
    window.blessyou.speak(UTTERANCE);
  }
}

export function warmUpVoices() {
  if (!("speechSynthesis" in window)) return;
  speechSynthesis.getVoices();
  speechSynthesis.addEventListener?.("voiceschanged", () => {
    speechSynthesis.getVoices();
  });
}

/** Safari only speaks after speechSynthesis is used in a user gesture. */
export function unlockSpeech() {
  if (!("speechSynthesis" in window)) return;
  try {
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    speechSynthesis.speak(utterance);
  } catch (error) {
    console.warn("Could not unlock speech", error?.message || error);
  }
}
