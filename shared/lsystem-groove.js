/**
 * L-system rewrite for binary drum patterns (one generation per bar).
 * Slides a read window and rotates rule sets so grooves keep shifting.
 */

const RULE_SETS = [
  { A: "AB", B: "A" },
  { A: "ABA", B: "AB" },
  { A: "AB", B: "ABB" },
  { A: "AAB", B: "A" },
  { A: "AB", B: "BA" },
];

function symbolToBit(ch) {
  if (ch === "A" || ch === "1") return true;
  if (ch === "B" || ch === "0") return false;
  return null;
}

/** @param {string} axiom e.g. "A" */
export function createLSystemGroove(axiom = "A", rules = RULE_SETS[0]) {
  let state = axiom;
  let generation = 0;
  let readOffset = 0;
  let ruleIndex = 0;
  let activeRules = { ...rules };

  function bitsFromState() {
    const bits = [];
    for (const ch of state) {
      const b = symbolToBit(ch);
      if (b !== null) bits.push(b);
    }
    return bits;
  }

  function rewrite() {
    generation++;
    let next = "";
    for (const ch of state) {
      next += activeRules[ch] ?? ch;
    }
    // Keep the growing tail — the start stabilizes fastest on short windows.
    state = next.length > 768 ? next.slice(-768) : next;
    const bits = bitsFromState();
    const len = Math.max(1, bits.length);
    readOffset = (readOffset + 1 + (generation % 7)) % len;

    if (generation % 2 === 0) {
      ruleIndex = (ruleIndex + 1) % RULE_SETS.length;
      activeRules = { ...RULE_SETS[ruleIndex] };
    }
    return state;
  }

  function toPattern(steps = 16, rowOffset = 0) {
    const bits = bitsFromState();
    if (!bits.length) return Array(steps).fill(false);
    const out = Array(steps).fill(false);
    const len = bits.length;
    const start = (readOffset + rowOffset) % len;
    for (let i = 0; i < steps; i++) {
      out[i] = bits[(start + i) % len];
    }
    return out;
  }

  function getState() {
    return state;
  }

  function getGeneration() {
    return generation;
  }

  function getRuleLabel() {
    return `A→${activeRules.A}, B→${activeRules.B}`;
  }

  function reset(next = axiom) {
    state = next;
    generation = 0;
    readOffset = 0;
    ruleIndex = 0;
    activeRules = { ...RULE_SETS[0] };
  }

  return { rewrite, toPattern, getState, getGeneration, getRuleLabel, reset };
}
