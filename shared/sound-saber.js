/**
 * Sound Saber voice — inspired by fourMs fSM.soundsaber (MoCap-Synthesiser).
 * Pulse exciter, parallel feedback delays, ring modulation, bandpass filter.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * Phone-side proxy for fFE.3D1 features (velocity + height).
 */
export function createMotionFeatures({ smooth = 0.14 } = {}) {
  let last = { x: 0, y: 0, z: 0 };
  let primed = false;
  let absoluteVelocity = 0;
  let horizontalVelocity = 0;
  let deltaZ = 0;
  let z = 0.5;

  return {
    reset() {
      primed = false;
      absoluteVelocity = horizontalVelocity = deltaZ = 0;
      z = 0.5;
    },

    /**
     * @param {{ x: number, y: number, z: number, linear?: { x: number, y: number, z: number } | null }} data
     */
    update(data) {
      const lin = data.linear;
      const lx = lin?.x ?? data.x;
      const ly = lin?.y ?? data.y;
      const lz = lin?.z ?? data.z;

      if (!primed) {
        last = { x: lx, y: ly, z: lz };
        primed = true;
        return { absoluteVelocity, horizontalVelocity, deltaZ, z };
      }

      const clip = (v, m) => clamp(v, -m, m);
      const dx = clip(lx - last.x, 3.5);
      const dy = clip(ly - last.y, 3.5);
      const dz = clip(lz - last.z, 3.5);
      last = { x: lx, y: ly, z: lz };

      const instAbs = Math.hypot(dx, dy, dz);
      const instHor = Math.hypot(dx, dy);
      const instVert = Math.abs(dz);
      const k = smooth;
      absoluteVelocity = absoluteVelocity * (1 - k) + instAbs * k;
      horizontalVelocity = horizontalVelocity * (1 - k) + instHor * k;
      deltaZ = deltaZ * (1 - k) + instVert * k;

      const mag = Math.hypot(data.x, data.y, data.z) || 1;
      const zNorm = clamp((data.z / mag + 1) * 0.5, 0, 1);
      z = z * (1 - k) + zNorm * k;

      return { absoluteVelocity, horizontalVelocity, deltaZ, z };
    },
  };
}

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} destination
 */
export function createSoundSaberVoice(ctx, destination) {
  const pulse = ctx.createOscillator();
  pulse.type = "square";
  pulse.frequency.value = 118;

  const pulseGain = ctx.createGain();
  pulseGain.gain.value = 0.32;

  const delayA = ctx.createDelay(0.55);
  delayA.delayTime.value = 0.07;
  const fbA = ctx.createGain();
  fbA.gain.value = 0.78;
  const wetA = ctx.createGain();
  wetA.gain.value = 0.48;

  const delayB = ctx.createDelay(0.55);
  delayB.delayTime.value = 0.11;
  const fbB = ctx.createGain();
  fbB.gain.value = 0.72;
  const wetB = ctx.createGain();
  wetB.gain.value = 0.48;

  const comb = ctx.createGain();
  comb.gain.value = 1;

  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 48;
  highpass.Q.value = 0.7;

  const ring = ctx.createGain();
  ring.gain.value = 0;
  const ringMod = ctx.createOscillator();
  ringMod.type = "sine";
  ringMod.frequency.value = 88;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 900;
  filter.Q.value = 4.5;

  const out = ctx.createGain();
  out.gain.value = 0;

  pulse.connect(pulseGain);
  pulseGain.connect(delayA);
  pulseGain.connect(delayB);
  delayA.connect(fbA);
  fbA.connect(delayA);
  delayA.connect(wetA);
  delayB.connect(fbB);
  fbB.connect(delayB);
  delayB.connect(wetB);
  wetA.connect(comb);
  wetB.connect(comb);
  comb.connect(highpass);
  highpass.connect(ring);
  ringMod.connect(ring.gain);
  ring.connect(filter);
  filter.connect(out);
  out.connect(destination);

  pulse.start();
  ringMod.start();

  return {
    apply(features, { holding = false, alpha = 0, beta = 45 } = {}) {
      const t = ctx.currentTime;
      if (!holding) {
        out.gain.setTargetAtTime(0, t, 0.05);
        ring.gain.setTargetAtTime(0, t, 0.04);
        return;
      }

      const { absoluteVelocity: absV, horizontalVelocity: horV, deltaZ: vertV, z: zPos } = features;
      const vel = clamp(absV, 0, 5);
      const amp = Math.pow(clamp(vel / 2.6, 0, 1), 1.55) * 0.58;

      const hor = clamp(horV, 0, 4);
      const vert = clamp(vertV, 0, 4);
      const zc = clamp(zPos, 0, 1);

      delayA.delayTime.setTargetAtTime(0.022 + (hor / 4) * 0.15, t, 0.07);
      delayB.delayTime.setTargetAtTime(0.028 + (vert / 4) * 0.17, t, 0.07);
      fbA.gain.setTargetAtTime(0.62 + hor * 0.06, t, 0.09);
      fbB.gain.setTargetAtTime(0.58 + vert * 0.07, t, 0.09);

      const freq = 70 + zc * 6200;
      const q = 1.2 + zc * 7.2;
      filter.frequency.setTargetAtTime(freq, t, 0.05);
      filter.Q.setTargetAtTime(q, t, 0.05);

      const heading = ((alpha % 360) + 360) % 360;
      const el = clamp(beta, 0, 90) / 90;
      const ringHz = 45 + heading * 0.85 + el * 260 + hor * 18;
      ringMod.frequency.setTargetAtTime(ringHz, t, 0.04);
      ring.gain.setTargetAtTime(0.22 + amp * 0.55, t, 0.03);
      pulse.frequency.setTargetAtTime(96 + vel * 14 + zc * 40, t, 0.06);
      out.gain.setTargetAtTime(amp, t, 0.025);
    },
  };
}
