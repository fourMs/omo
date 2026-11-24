/**
 * Evolver for the Green Button: a small population of timbre genomes that
 * evolves while the player holds still.
 *
 * Each genome is six genes in -1..1 (what they do is up to the voice; see
 * green-swell.js evolve()). On every step the evolver breeds a few mutants
 * from parents chosen by fitness and plays the most novel one: novelty is the
 * mean distance to the genomes heard recently, so the sound keeps moving
 * rather than settling (novelty search).
 *
 * Fitness comes from how the player listens, a simple reinforcement signal:
 * a genome that is held through to the next step earns +1, one that makes
 * the player let go within RELEASE_PENALTY_S of its arrival earns -1, and
 * one still sounding at an ordinary release earns +0.5. Fitness is a running
 * average, so genomes that people linger on survive. The population is kept
 * in localStorage, so each phone slowly learns what its player listens to.
 */

const GENES = 6;
const POP = 10;
const CANDIDATES = 6;
const SIGMA = 0.35;
const ARCHIVE = 12;
export const RELEASE_PENALTY_S = 1.5;

const clamp = (v) => Math.max(-1, Math.min(1, v));
const gauss = () => {
  let u = 0;
  let v = 0;
  while (!u) u = Math.random();
  while (!v) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};
const dist = (a, b) => Math.sqrt(a.reduce((s, x, i) => s + (x - b[i]) ** 2, 0) / a.length);

export function createEvolver(storageKey = "omo-green-evolve-v1") {
  let pop = null;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (Array.isArray(saved) && saved.every((p) => Array.isArray(p.g) && p.g.length === GENES)) pop = saved;
  } catch {
    /* storage blocked or corrupt: start fresh */
  }
  if (!pop) pop = Array.from({ length: POP }, () => ({ g: Array.from({ length: GENES }, () => clamp(gauss() * 0.4)), fit: 0, n: 0 }));

  const archive = [];
  let current = null; // { g, arrived } — the genome now sounding

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(pop));
    } catch {
      /* noop */
    }
  }

  function tournament() {
    const a = pop[Math.floor(Math.random() * pop.length)];
    const b = pop[Math.floor(Math.random() * pop.length)];
    return a.fit >= b.fit ? a : b;
  }

  function novelty(g) {
    if (!archive.length) return 1;
    const d = archive.map((h) => dist(g, h)).sort((x, y) => x - y);
    const k = d.slice(0, 4);
    return k.reduce((s, x) => s + x, 0) / k.length;
  }

  function reward(r) {
    if (!current) return;
    const entry = pop.find((p) => p.g === current.g);
    if (entry) {
      entry.n += 1;
      entry.fit += (r - entry.fit) / Math.min(entry.n, 8);
    } else {
      pop.push({ g: current.g, fit: r, n: 1 });
      if (pop.length > POP) {
        let worst = 0;
        pop.forEach((p, i) => {
          if (p.fit < pop[worst].fit) worst = i;
        });
        pop.splice(worst, 1);
      }
    }
    save();
  }

  return {
    /** Called at the start of each hold: nothing is sounding from the population yet. */
    begin() {
      current = null;
    },

    /** The next genome to play: the previous one was held through, so it is rewarded. */
    next(now) {
      reward(1);
      let best = null;
      let bestScore = -Infinity;
      for (let i = 0; i < CANDIDATES; i++) {
        const parent = tournament();
        const child = parent.g.map((x) => clamp(x + gauss() * SIGMA));
        const score = novelty(child) + 0.25 * parent.fit;
        if (score > bestScore) {
          bestScore = score;
          best = child;
        }
      }
      archive.push(best);
      if (archive.length > ARCHIVE) archive.shift();
      current = { g: best, arrived: now };
      return best;
    },

    /** The player let go: a quick release after a change counts against that genome. */
    release(now) {
      if (!current) return;
      reward(now - current.arrived < RELEASE_PENALTY_S ? -1 : 0.5);
      current = null;
    },

    /** For display and tests: the population with its fitness. */
    population: () => pop.map((p) => ({ g: p.g.slice(), fit: p.fit, n: p.n })),
  };
}
