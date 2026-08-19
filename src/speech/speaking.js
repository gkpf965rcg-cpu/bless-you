/**
 * BlessYouSpeaking contract: speakBlessYou() plays the blessing locally.
 * macOS uses the Web Speech API (on-device voices). A future Windows port
 * can call a native TTS engine through the same function names.
 */
const UTTERANCE = "Bless you.";

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

function speakInBrowser() {
  if (!("speechSynthesis" in window)) return false;

  speechSynthesis.cancel();
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
  speechSynthesis.speak(utterance);
  return true;
}

export function speakBlessYou() {
  const voices = speechSynthesis.getVoices?.() || [];
  if (voices.length === 0 && window.blessyou?.speak) {
    window.blessyou.speak(UTTERANCE).then((ok) => {
      if (!ok) speakInBrowser();
    });
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
