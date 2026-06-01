/**
 * 2nd-order Markov chain over scale degrees.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const MARKOV_SCALES = {
  pentatonic: { label: "Pentatonic", intervals: [0, 2, 4, 7, 9] },
  major: { label: "Major", intervals: [0, 2, 4, 5, 7, 9, 11] },
  minor: { label: "Natural minor", intervals: [0, 2, 3, 5, 7, 8, 10] },
  chromatic: { label: "Chromatic", intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
};

const NOTE_NAMES = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

/** @param {number} midi @param {number} rootMidi @param {number[]} intervals @param {number} octaves */
export function midiToDegree(midi, rootMidi, intervals, octaves = 2) {
  const rel = ((midi - rootMidi) % 12 + 12) % 12;
  const idx = intervals.indexOf(rel);
  if (idx < 0) return null;
  const oct = Math.floor((midi - rootMidi) / 12);
  if (oct < 0 || oct >= octaves) return null;
  return oct * intervals.length + idx;
}

/** @param {number} degree @param {number} rootMidi @param {number[]} intervals */
export function degreeToMidi(degree, rootMidi, intervals) {
  const per = intervals.length;
  const oct = Math.floor(degree / per);
  const idx = ((degree % per) + per) % per;
  return rootMidi + oct * 12 + intervals[idx];
}

export function labelForDegree(degree, rootMidi, intervals) {
  const midi = degreeToMidi(degree, rootMidi, intervals);
  const pc = ((midi % 12) + 12) % 12;
  const oct = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[pc]}${oct}`;
}

/**
 * @param {{ scale?: number[], intervals?: number[], order?: number, octaves?: number }} [opts]
 */
export function createMarkovMelody(opts = {}) {
  let intervals = opts.intervals ?? opts.scale ?? MARKOV_SCALES.pentatonic.intervals;
  const octaves = opts.octaves ?? 2;
  const order = opts.order ?? 2;
  const counts = new Map();
  let history = [];
  let total = 0;

  function keyFromHistory(h) {
    return h.join(",");
  }

  function maxDegree() {
    return intervals.length * octaves - 1;
  }

  function observeDegree(degIndex) {
    const d = clamp(Math.round(degIndex), 0, maxDegree());
    if (history.length >= order) {
      const k = keyFromHistory(history.slice(-order));
      const row = counts.get(k) || new Map();
      row.set(d, (row.get(d) || 0) + 1);
      counts.set(k, row);
      total++;
    }
    history.push(d);
    if (history.length > order * 4) history.shift();
  }

  function sample() {
    if (history.length < order || total < 2) {
      return Math.floor(Math.random() * (maxDegree() + 1));
    }
    const k = keyFromHistory(history.slice(-order));
    const row = counts.get(k);
    if (!row || row.size === 0) {
      return Math.floor(Math.random() * (maxDegree() + 1));
    }
    let sum = 0;
    for (const v of row.values()) sum += v;
    let r = Math.random() * sum;
    for (const [deg, c] of row) {
      r -= c;
      if (r <= 0) {
        history.push(deg);
        if (history.length > order * 4) history.shift();
        return deg;
      }
    }
    const first = [...row.keys()][0];
    history.push(first);
    return first;
  }

  function reset() {
    counts.clear();
    history = [];
    total = 0;
  }

  function getIntervals() {
    return intervals;
  }

  function getOctaves() {
    return octaves;
  }

  function setIntervals(next) {
    intervals = [...next];
    reset();
  }

  function trainingSize() {
    return total;
  }

  return {
    observeDegree,
    sample,
    reset,
    getIntervals,
    getOctaves,
    setIntervals,
    maxDegree,
    trainingSize,
    /** @deprecated use getIntervals */
    getScale: getIntervals,
  };
}
