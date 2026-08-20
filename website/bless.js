(() => {
  // src/paths.js
  function appDirectoryUrl() {
    const url = new URL(window.location.href);
    url.hash = "";
    url.search = "";
    let path = url.pathname || "/";
    if (!path.endsWith("/")) {
      const last = path.split("/").pop() || "";
      if (last.includes(".")) {
        path = path.slice(0, path.lastIndexOf("/") + 1);
      } else {
        path += "/";
      }
    }
    url.pathname = path;
    return url;
  }

  // src/speech/playlist.js
  function shuffleCycle(items, previousLast) {
    const next = items.slice();
    for (let i = next.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const swap = next[i];
      next[i] = next[j];
      next[j] = swap;
    }
    if (next.length > 1 && previousLast != null && next[0] === previousLast) {
      const swapWith = 1 + Math.floor(Math.random() * (next.length - 1));
      const swap = next[0];
      next[0] = next[swapWith];
      next[swapWith] = swap;
    }
    return next;
  }
  function createClipPlaylist(clips) {
    let order = [];
    let index = 0;
    let lastPlayed = null;
    return {
      next() {
        if (!clips.length) return null;
        if (index >= order.length) {
          order = shuffleCycle(clips, lastPlayed);
          index = 0;
        }
        const clip = order[index];
        index += 1;
        lastPlayed = clip;
        return clip;
      }
    };
  }

  // src/speech/speaking.js
  var BLESS_YOU_CLIPS = [
    "bless-you-1.wav",
    "bless-you-2.wav",
    "bless-you-3.wav",
    "bless-you-4.wav"
  ];
  var playlist = createClipPlaylist(BLESS_YOU_CLIPS);
  var players = /* @__PURE__ */ new Map();
  var playing = false;
  var playToken = 0;
  function isAppPage() {
    const path = (window.location.pathname || "/").replace(/\\/g, "/");
    return path.includes("/app/") || /\/app\/?$/.test(path);
  }
  function clipUrl(filename) {
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
  function speakBlessYou() {
    if (playing) return;
    playing = true;
    tryPlay(BLESS_YOU_CLIPS.length);
  }
  function warmUpVoices() {
    if (typeof Audio === "undefined") return;
    try {
      for (const filename of BLESS_YOU_CLIPS) {
        playerFor(filename);
      }
    } catch (error) {
      console.warn("Could not preload bless-you recordings", error?.message || error);
    }
  }

  // src/web-remarks.js
  var HOLD_MS = 8e3;
  function startRemarks() {
    const root = document.querySelector("[data-remarks]");
    if (!root) return;
    const remarks = [...root.querySelectorAll(".remark")];
    if (!remarks.length) return;
    const playlist2 = createClipPlaylist(remarks);
    const show = (next) => {
      if (!next) return;
      for (const el of remarks) {
        const visible = el === next;
        el.classList.toggle("is-visible", visible);
        el.setAttribute("aria-hidden", visible ? "false" : "true");
      }
      root.classList.add("is-ready");
    };
    show(playlist2.next());
    if (remarks.length > 1) {
      window.setInterval(() => show(playlist2.next()), HOLD_MS);
    }
  }

  // src/web-bless.js
  warmUpVoices();
  startRemarks();
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
