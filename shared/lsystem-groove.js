/**
 * L-system rewrite for binary drum patterns (one generation per bar).
 */

/** @param {string} axiom e.g. "A" */
export function createLSystemGroove(axiom = "A", rules = { A: "AB", B: "A" }) {
  let state = axiom;

  function rewrite() {
    let next = "";
    for (const ch of state) {
      next += rules[ch] ?? ch;
    }
    state = next.slice(0, 256);
    return state;
  }

  function toPattern(steps = 16) {
    const bits = [];
    for (const ch of state) {
      if (ch === "A" || ch === "1") bits.push(true);
      else if (ch === "B" || ch === "0") bits.push(false);
    }
    if (!bits.length) return Array(steps).fill(false);
    const out = Array(steps).fill(false);
    for (let i = 0; i < steps; i++) out[i] = bits[i % bits.length];
    return out;
  }

  function getState() {
    return state;
  }

  function reset(next = axiom) {
    state = next;
  }

  return { rewrite, toPattern, getState, reset };
}
