/**
 * Euclidean rhythms — even pulse distribution (Bresenham-style).
 */

/** @returns {boolean[]} length `steps` */
export function euclideanRhythm(pulses, steps, rotation = 0) {
  const s = Math.max(1, Math.floor(steps));
  const p = Math.max(0, Math.min(s, Math.floor(pulses)));
  if (p === 0) return Array(s).fill(false);
  if (p === s) return Array(s).fill(true);

  const pattern = Array(s).fill(false);
  let bucket = 0;
  for (let i = 0; i < s; i++) {
    bucket -= p;
    if (bucket < 0) {
      bucket += s;
      pattern[i] = true;
    }
  }

  const rot = ((rotation % s) + s) % s;
  return Array.from({ length: s }, (_, i) => pattern[(i - rot + s) % s]);
}
