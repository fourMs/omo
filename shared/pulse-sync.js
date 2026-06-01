/**
 * Firefly-style pulse oscillator — local clicks that entrain to heard onsets.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function median(nums) {
  if (!nums.length) return null;
  const s = [...nums].sort((a, b) => a - b);
  const m = (s.length / 2) | 0;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function wrapPhase(err, period) {
  let e = err % period;
  if (e > period / 2) e -= period;
  if (e < -period / 2) e += period;
  return e;
}

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 * @param {{ bpm?: number, level?: number, onPulse?: (t: number) => void, onSync?: (state: object) => void }} opts
 */
export function createFireflyPulse(ctx, dest, opts = {}) {
  let bpm = opts.bpm ?? 72;
  let period = 60 / bpm;
  let nextPulse = ctx.currentTime + 0.08;
  let lastExternal = 0;
  const intervals = [];
  const pullRate = 0.1;
  const phasePull = 0.18;
  let running = false;
  let raf = 0;
  let lastStrength = 0;
  let beatInBar = 0;

  function playClick(t) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.04);
    env.gain.setValueAtTime(0.001, t);
    env.gain.exponentialRampToValueAtTime(opts.level ?? 0.35, t + 0.002);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.connect(env);
    env.connect(dest);
    osc.start(t);
    osc.stop(t + 0.08);
    const downbeat = beatInBar === 0;
    beatInBar = (beatInBar + 1) % 4;
    opts.onPulse?.(t, downbeat);
  }

  function emitSync(phaseErr = 0) {
    const lock =
      intervals.length >= 3
        ? clamp(1 - Math.abs(phaseErr) / (period * 0.5), 0, 1)
        : 0;
    opts.onSync?.({
      bpm: 60 / period,
      period,
      phaseMs: phaseErr * 1000,
      lock,
      heard: intervals.length,
      strength: lastStrength,
    });
  }

  function schedule() {
    const now = ctx.currentTime;
    while (nextPulse < now + 0.14) {
      if (nextPulse >= now - 0.02) playClick(nextPulse);
      nextPulse += period;
    }
  }

  function tick() {
    if (!running) return;
    schedule();
    raf = requestAnimationFrame(tick);
  }

  return {
    start() {
      if (running) return;
      running = true;
      beatInBar = 0;
      nextPulse = ctx.currentTime + 0.1;
      tick();
    },

    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },

    setBpm(next) {
      bpm = clamp(next, 30, 200);
      period = 60 / bpm;
    },

    getBpm() {
      return 60 / period;
    },

    /** Heard pulse from mic or another device. */
    externalPulse(t, strength = 0) {
      lastStrength = strength;
      if (lastExternal > 0) {
        const dt = t - lastExternal;
        if (dt > 0.18 && dt < 2.8) {
          intervals.push(dt);
          if (intervals.length > 10) intervals.shift();
          const med = median(intervals);
          if (med) period = period * (1 - pullRate) + med * pullRate;
        }
      }
      lastExternal = t;

      const err = wrapPhase(t - nextPulse, period);
      nextPulse += err * phasePull;
      emitSync(err);
    },
  };
}
