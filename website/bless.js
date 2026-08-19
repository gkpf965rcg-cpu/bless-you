(() => {
  // src/speech/speaking.js
  var UTTERANCE = "Bless you.";
  var currentUtterance = null;
  var speakTimer = 0;
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
    return voices.find((voice) => voice.lang?.toLowerCase().startsWith("en-gb")) || voices.find((voice) => voice.lang?.toLowerCase().startsWith("en")) || null;
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
    }
    speechSynthesis.speak(utterance);
  }
  function speakInBrowser() {
    if (!("speechSynthesis" in window)) return false;
    window.clearTimeout(speakTimer);
    if (currentUtterance && (speechSynthesis.speaking || speechSynthesis.pending)) {
      speechSynthesis.cancel();
      speakTimer = window.setTimeout(queueUtterance, 50);
      return true;
    }
    queueUtterance();
    return true;
  }
  function speakBlessYou() {
    if (window.blessyou?.platform === "linux" && window.blessyou.speak) {
      window.blessyou.speak(UTTERANCE);
      return;
    }
    if (!speakInBrowser() && window.blessyou?.speak) {
      window.blessyou.speak(UTTERANCE);
    }
  }
  function warmUpVoices() {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener?.("voiceschanged", () => {
      speechSynthesis.getVoices();
    });
  }

  // src/web-bless.js
  warmUpVoices();
  function blessNow(event) {
    event.preventDefault();
    speakBlessYou();
  }
  document.querySelectorAll("[data-bless]").forEach((el) => {
    el.addEventListener("click", blessNow);
  });
  document.querySelectorAll("#back").forEach((el) => {
    el.addEventListener("click", (event) => {
      if (window.history.length > 1) {
        event.preventDefault();
        window.history.back();
      }
    });
  });
})();
