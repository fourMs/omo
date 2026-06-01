/**
 * CliX-style impulse + resonant filter (after Ge Wang / SMELT clix.ck).
 * Grid phase sets velocity; ASCII code sets pitch via MIDI mtof.
 */

export const SAMPLES_PER_CELL = 4096;
export const GRID_W = 8;
export const GRID_H = 4;

/** Velocity map — index = y * 8 + x (from clix.ck). */
export const CLIX_GAINS = [
  1.0, 0.2, 0.3, 0.2, 0.4, 0.1, 0.2, 0.1,
  0.5, 0.1, 0.3, 0.2, 0.4, 0.1, 0.2, 0.1,
  0.8, 0.1, 0.3, 0.2, 0.5, 0.1, 0.2, 0.1,
  0.4, 0.1, 0.3, 0.2, 0.3, 0.1, 0.2, 0.1,
];

export function cellDurationSec(ctx) {
  return SAMPLES_PER_CELL / ctx.sampleRate;
}

export function periodDurationSec(ctx) {
  return cellDurationSec(ctx) * CLIX_GAINS.length;
}

/** Chuck std.mtof — MIDI note number to Hz. */
export function mtof(note) {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export function gainAt(x, y) {
  const index = y * GRID_W + x;
  return CLIX_GAINS[index] ?? 0.1;
}

/** Grid cell from shared start time (ms); works before AudioContext exists. */
export function gridAtTime(startMs, sampleRate = 48000, nowMs = Date.now()) {
  const cellMs = (SAMPLES_PER_CELL / sampleRate) * 1000;
  const idx = Math.floor((nowMs - startMs) / cellMs) % CLIX_GAINS.length;
  const x = idx % GRID_W;
  const y = (idx / GRID_W) | 0;
  return { x, y, index: idx };
}

/** Grid cell from shared start time (ms). */
export function gridAt(startMs, ctx, nowMs = Date.now()) {
  return gridAtTime(startMs, ctx.sampleRate, nowMs);
}

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 * @param {number} ascii — character code (Chuck uses this as MIDI note)
 * @param {number} gain — 0..1 velocity from grid
 * @param {number} channelIndex — rotates like dac.chan(which)
 */
export function playClixNote(ctx, dest, ascii, gain, channelIndex = 0) {
  const t0 = ctx.currentTime;
  const len = Math.max(0.002, cellDurationSec(ctx) - 0.002);
  const freq = mtof(ascii);

  const impulseLen = Math.ceil(ctx.sampleRate * 0.003);
  const buf = ctx.createBuffer(1, impulseLen, ctx.sampleRate);
  const d = buf.getChannelData(0);
  d[0] = 1.0;

  const src = ctx.createBufferSource();
  src.buffer = buf;

  const f = ctx.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = Math.min(18000, Math.max(40, freq));
  f.Q.value = 18;

  const e = ctx.createGain();
  const peak = Math.max(0.001, gain * 0.85);
  e.gain.setValueAtTime(0.0001, t0);
  e.gain.linearRampToValueAtTime(peak, t0 + 0.001);
  e.gain.exponentialRampToValueAtTime(0.0001, t0 + len);

  const pan = ctx.createStereoPanner();
  const n = 2;
  pan.pan.value = ((channelIndex % n) / (n - 1 || 1)) * 2 - 1;

  src.connect(f);
  f.connect(e);
  e.connect(pan);
  pan.connect(dest);

  src.start(t0);
  src.stop(t0 + len + 0.05);
}

/** Light JCRev-style wet mix (~0.02 in clix.ck). Returns input node. */
export function createClixReverb(ctx, destination) {
  const input = ctx.createGain();
  const dry = ctx.createGain();
  dry.gain.value = 1;
  input.connect(dry);
  dry.connect(destination);

  const wet = ctx.createGain();
  wet.gain.value = 0.02;
  const len = Math.floor(ctx.sampleRate * 1.8);
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.2);
    }
  }
  const conv = ctx.createConvolver();
  conv.buffer = impulse;
  input.connect(conv);
  conv.connect(wet);
  wet.connect(destination);
  return input;
}
