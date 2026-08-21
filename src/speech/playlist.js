/**
 * Walk through every clip once per cycle, then reshuffle.
 * The first clip of a new cycle is never the last clip of the previous cycle.
 */
export function shuffleCycle(items, previousLast) {
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

export function createClipPlaylist(clips) {
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
