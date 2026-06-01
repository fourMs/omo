/**
 * Gentle bowed string — low-feedback loop + soft friction (stable, not runaway).
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 * @param {number} [freqHz]
 */
export function createBowedString(ctx, dest, freqHz = 220) {
  const delay = ctx.createDelay(1.2);

  const loopLp = ctx.createBiquadFilter();
  loopLp.type = "lowpass";
  loopLp.Q.value = 0.6;

  const dc = ctx.createBiquadFilter();
  dc.type = "highpass";
  dc.frequency.value = 35;
  dc.Q.value = 0.7;

  const fb = ctx.createGain();
  fb.gain.value = 0;

  const bowIn = ctx.createGain();
  bowIn.gain.value = 0;

  const out = ctx.createGain();
  out.gain.value = 0;

  const bowOsc = ctx.createOscillator();
  bowOsc.type = "triangle";

  const bowAmp = ctx.createGain();
  bowAmp.gain.value = 0;

  bowOsc.connect(bowAmp);
  bowAmp.connect(bowIn);
  bowIn.connect(delay);
  delay.connect(loopLp);
  loopLp.connect(dc);
  dc.connect(fb);
  fb.connect(delay);
  dc.connect(out);
  out.connect(dest);
  bowOsc.start();

  let smoothHz = freqHz;

  function applyPitch(hz) {
    smoothHz = smoothHz * 0.88 + clamp(hz, 55, 720) * 0.12;
    const t = ctx.currentTime;
    const period = 1 / smoothHz;
    delay.delayTime.setTargetAtTime(period, t, 0.1);
    loopLp.frequency.setTargetAtTime(clamp(smoothHz * 4, 320, 5200), t, 0.08);
    bowOsc.frequency.setTargetAtTime(smoothHz * 0.5, t, 0.08);
  }

  applyPitch(freqHz);

  return {
    setBow(force) {
      const bow = clamp(force, 0, 1);
      const t = ctx.currentTime;
      const press = bow * bow;
      bowAmp.gain.setTargetAtTime(press * 0.04, t, 0.07);
      bowIn.gain.setTargetAtTime(press * 0.006, t, 0.07);
      const loop = bow > 0.04 ? 0.94 + press * 0.028 : 0;
      fb.gain.setTargetAtTime(loop, t, 0.12);
      out.gain.setTargetAtTime(bow > 0.03 ? 0.05 + press * 0.12 : 0, t, 0.08);
    },

    setPitch(hz) {
      applyPitch(hz);
    },

    release() {
      const t = ctx.currentTime;
      bowAmp.gain.setTargetAtTime(0, t, 0.08);
      bowIn.gain.setTargetAtTime(0, t, 0.08);
      fb.gain.setTargetAtTime(0.92, t, 0.2);
      out.gain.setTargetAtTime(0.04, t, 0.15);
      fb.gain.setTargetAtTime(0, t + 2.2, 0.7);
      out.gain.setTargetAtTime(0, t + 2.5, 0.4);
    },

    stop() {
      const t = ctx.currentTime;
      bowAmp.gain.setTargetAtTime(0, t, 0.02);
      bowIn.gain.setTargetAtTime(0, t, 0.02);
      fb.gain.setTargetAtTime(0, t, 0.04);
      out.gain.setTargetAtTime(0, t, 0.04);
    },
  };
}
