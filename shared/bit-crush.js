/**
 * Lo-fi bit reduction — quantize curve + network crush hint.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** @param {number} bits 2–16 */
export function crushCurve(bits) {
  const steps = Math.max(2, Math.min(256, 2 ** Math.floor(bits)));
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i / 127.5 - 1) * 3;
    curve[i] = Math.round(x * steps) / steps;
  }
  return curve;
}

/** 0 = clean, 1 = heavy crush */
export function networkCrushAmount() {
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const t = conn?.effectiveType;
  const map = { "slow-2g": 1, "2g": 0.88, "3g": 0.55, "4g": 0.22 };
  return map[t] ?? 0.4;
}

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 */
export function createBitCrushChain(ctx, dest) {
  const shaper = ctx.createWaveShaper();
  shaper.curve = crushCurve(12);
  shaper.oversample = "none";
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 8000;
  const out = ctx.createGain();
  out.gain.value = 1;
  shaper.connect(lp);
  lp.connect(out);
  out.connect(dest);
  return {
    input: shaper,
    out,
    setCrush(amount, when = ctx.currentTime) {
      const a = clamp(amount, 0, 1);
      const bits = 16 - a * 13;
      shaper.curve = crushCurve(bits);
      lp.frequency.setTargetAtTime(2000 + (1 - a) * 10000, when, 0.04);
    },
  };
}
