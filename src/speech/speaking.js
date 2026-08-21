/**
 * BlessYouSpeaking contract: speakBlessYou() plays a recorded blessing locally.
 * Clips live in website/app/audio/ and are played at their natural pitch and speed.
 */
import { appDirectoryUrl } from "../paths.js";
import { createClipPlaylist } from "./playlist.js";

export const BLESS_YOU_CLIPS = [
  "bless-you-1.wav",
  "bless-you-2.wav",
  "bless-you-3.wav",
  "bless-you-4.wav"
];

const playlist = createClipPlaylist(BLESS_YOU_CLIPS);
const players = new Map();
let playing = false;
let playToken = 0;

function isAppPage() {
  const path = (window.location.pathname || "/").replace(/\\/g, "/");
  return path.includes("/app/") || /\/app\/?$/.test(path);
}

export function clipUrl(filename) {
  if (isAppPage()) {
    return new URL(`audio/${filename}`, appDirectoryUrl()).href;
  }
  return new URL(`app/audio/${filename}`, window.location.href).href;
}

function playerFor(filename) {
  let el = players.get(filename);
  if (el) return el;
  el = new Audio();
  el.preload = "auto";
  el.playbackRate = 1;
  el.src = clipUrl(filename);
  players.set(filename, el);
  return el;
}

function pauseOthers(except) {
  for (const el of players.values()) {
    if (el === except) continue;
    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      // Ignore.
    }
  }
}

function tryPlay(remaining) {
  if (remaining <= 0) {
    playing = false;
    return;
  }
  if (typeof Audio === "undefined") {
    console.warn("This browser cannot play bless-you recordings");
    playing = false;
    return;
  }

  const filename = playlist.next();
  if (!filename) {
    playing = false;
    return;
  }

  const token = ++playToken;
  let settled = false;
  const el = playerFor(filename);
  playing = true;
  pauseOthers(el);

  const finish = (ok) => {
    if (token !== playToken || settled) return;
    settled = true;
    if (ok) {
      playing = false;
      return;
    }
    console.warn("Could not play bless-you recording", filename);
    tryPlay(remaining - 1);
  };

  el.onended = () => finish(true);
  el.onerror = () => finish(false);

  try {
    el.muted = false;
    el.volume = 1;
    el.playbackRate = 1;
    el.currentTime = 0;
  } catch {
    // Some browsers throw if the file is not loaded yet.
  }

  try {
    const start = el.play();
    if (start && typeof start.then === "function") {
      start.catch(() => finish(false));
    }
  } catch (error) {
    console.warn("Could not play bless-you recording", error?.message || error);
    finish(false);
  }
}

export function speakBlessYou() {
  if (playing) return;
  playing = true;
  tryPlay(BLESS_YOU_CLIPS.length);
}

export function warmUpVoices() {
  if (typeof Audio === "undefined") return;
  try {
    for (const filename of BLESS_YOU_CLIPS) {
      playerFor(filename);
    }
  } catch (error) {
    console.warn("Could not preload bless-you recordings", error?.message || error);
  }
}

/** Safari / Chrome only play audio after a user gesture. */
export function unlockSpeech() {
  if (typeof Audio === "undefined") return;
  try {
    const el = playerFor(BLESS_YOU_CLIPS[0]);
    el.muted = true;
    const start = el.play();
    const restore = () => {
      try {
        el.pause();
        el.currentTime = 0;
      } catch {
        // Ignore.
      }
      el.muted = false;
    };
    if (start && typeof start.then === "function") {
      start.then(restore).catch(restore);
    } else {
      restore();
    }
  } catch (error) {
    console.warn("Could not unlock bless-you audio", error?.message || error);
  }
}
