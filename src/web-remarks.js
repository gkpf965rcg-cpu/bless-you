import { createClipPlaylist } from "./speech/playlist.js";

const HOLD_MS = 8000;

export function startRemarks() {
  const root = document.querySelector("[data-remarks]");
  if (!root) return;

  const remarks = [...root.querySelectorAll(".remark")];
  if (!remarks.length) return;

  const playlist = createClipPlaylist(remarks);

  const show = (next) => {
    if (!next) return;
    for (const el of remarks) {
      const visible = el === next;
      el.classList.toggle("is-visible", visible);
      el.setAttribute("aria-hidden", visible ? "false" : "true");
    }
    root.classList.add("is-ready");
  };

  show(playlist.next());
  if (remarks.length > 1) {
    window.setInterval(() => show(playlist.next()), HOLD_MS);
  }
}
