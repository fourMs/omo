/**
 * Small feedback delay network — gyro-steerable cross feedback.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 */
export function createFeedbackMatrix(ctx, dest) {
  const merger = ctx.createGain();
  merger.gain.value = 1;
  const mix = ctx.createGain();
  mix.gain.value = 0.58;
  mix.connect(dest);
  merger.connect(mix);

  /** Sustained excitation (noise) — not ducked by ping(). */
  const sustain = ctx.createGain();
  sustain.gain.value = 1;
  sustain.connect(merger);

  /** Short bursts — ping() only touches this gain. */
  const burst = ctx.createGain();
  burst.gain.value = 0;
  burst.connect(merger);

  const n = 4;
  const delays = [];
  const fbGains = [];

  for (let i = 0; i < n; i++) {
    const d = ctx.createDelay(0.6);
    d.delayTime.value = 0.08 + i * 0.06;
    const tap = ctx.createGain();
    tap.gain.value = 0.32;
    d.connect(tap);
    tap.connect(mix);
    delays.push(d);
    fbGains.push([]);
    for (let j = 0; j < n; j++) {
      const g = ctx.createGain();
      g.gain.value = i === j ? 0.02 : i === (j + 1) % n ? 0.4 : 0.07;
      delays[i].connect(g);
      g.connect(delays[j]);
      fbGains[i].push(g);
    }
  }

  return {
    /** Connect noise or other held exciters here. */
    input: sustain,
    /** @param {{ alpha?: number, beta?: number, gamma?: number }} rot rotation rates (deg/s) */
    setRouting(rot, when = ctx.currentTime) {
      const a = clamp((rot.alpha ?? 0) / 120, -1, 1);
      const b = clamp((rot.beta ?? 0) / 120, -1, 1);
      const g = clamp((rot.gamma ?? 0) / 120, -1, 1);
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i === j) {
            fbGains[i][j].gain.setTargetAtTime(0.02, when, 0.06);
            continue;
          }
          const base = i === (j + 1) % n ? 0.36 : 0.06;
          const wobble = (i * 0.31 + j * 0.17) % 1;
          const mod = base + wobble * 0.12 * a + ((i + j) % 2 ? b : g) * 0.1;
          fbGains[i][j].gain.setTargetAtTime(clamp(mod, 0.02, 0.72), when, 0.06);
        }
      }
    },
    ping(level = 0.5, when = ctx.currentTime) {
      burst.gain.cancelScheduledValues(when);
      burst.gain.setValueAtTime(level, when);
      burst.gain.exponentialRampToValueAtTime(0.001, when + 0.35);
    },
  };
}
