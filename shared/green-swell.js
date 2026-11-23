/**
 * Green Button swell voice: one held tone whose timbre follows where the
 * finger is inside the circle.
 *
 *   core    sine at the fundamental (always present, the soft centre)
 *   body    triangles at the fundamental and the octave, detuned apart; the
 *           spread widens towards the rim
 *   bright  sawtooth + square through a lowpass and a formant peak; level,
 *           cutoff and resonance grow towards the rim, the angle picks the
 *           colour (top brassy sawtooth, bottom hollow square, left a dark
 *           vowel-like formant, right a nasal one)
 *
 * On each hold the bright layer blooms in more slowly than the core swell,
 * and its filter opens two octaves as it does, so the sound grows from soft
 * to sharp. Vibrato (pitch and amplitude LFOs) is shared by all layers.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const SWELL_TAU = 0.15; // core swell time constant (s)
export const BLOOM_TAU = 0.5; // bright-layer bloom time constant (s)
const RELEASE_TAU = 0.25;
const BLOOM_CENTS = 2400; // filter opens this far during the bloom
const SWELL_LEVEL = 0.62;
const BASE_PITCH_CENTS = 11;
const BASE_AMP_DEPTH = 0.09;

/**
 * @param {BaseAudioContext} ctx
 * @param {AudioNode} dest
 */
export function createGreenSwell(ctx, dest) {
  const osc = (type, f = 220) => {
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.value = f;
    return o;
  };
  const gain = (v) => {
    const g = ctx.createGain();
    g.gain.value = v;
    return g;
  };

  // Shared vibrato.
  const pitchLfo = osc("sine", 5.2 + Math.random() * 1.5);
  const pitchDepth = gain(BASE_PITCH_CENTS);
  pitchLfo.connect(pitchDepth);
  const ampLfo = osc("sine", 0.28 + Math.random() * 0.12);
  const ampDepth = gain(BASE_AMP_DEPTH);
  ampLfo.connect(ampDepth);

  // toneGain = 1 + amp LFO; swellGain = the hold envelope.
  const toneGain = gain(1);
  ampDepth.connect(toneGain.gain);
  const swellGain = gain(0);
  toneGain.connect(swellGain);
  swellGain.connect(dest);

  const core = osc("sine");
  const coreLevel = gain(0.6);
  core.connect(coreLevel);
  coreLevel.connect(toneGain);

  // Body: fundamental and octave triangles (odd harmonics only, so the two
  // never share a partial and cannot cancel each other while detuned).
  const bodyA = osc("triangle");
  const bodyB = osc("triangle");
  const bodyALevel = gain(0.3);
  const bodyBLevel = gain(0.16);
  bodyA.connect(bodyALevel);
  bodyB.connect(bodyBLevel);
  bodyALevel.connect(toneGain);
  bodyBLevel.connect(toneGain);

  const saw = osc("sawtooth");
  const square = osc("square");
  const sawMix = gain(0.5);
  const squareMix = gain(0.5);
  saw.connect(sawMix);
  square.connect(squareMix);
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 800;
  lowpass.Q.value = 0.7;
  lowpass.detune.value = -BLOOM_CENTS;
  sawMix.connect(lowpass);
  squareMix.connect(lowpass);
  const formant = ctx.createBiquadFilter();
  formant.type = "peaking";
  formant.frequency.value = 1200;
  formant.Q.value = 2.5;
  formant.gain.value = 7;
  lowpass.connect(formant);
  const brightBloom = gain(0); // 0..1, driven by the bloom envelope
  const brightLevel = gain(0.2); // set by distance from centre
  formant.connect(brightBloom);
  brightBloom.connect(brightLevel);
  brightLevel.connect(toneGain);

  // One bloom envelope drives both the bright level and the cutoff opening.
  const bloom = ctx.createConstantSource();
  bloom.offset.value = 0;
  bloom.connect(brightBloom.gain);
  const bloomCents = gain(BLOOM_CENTS);
  bloom.connect(bloomCents);
  bloomCents.connect(lowpass.detune);

  const voices = [core, bodyA, bodyB, saw, square];
  voices.forEach((o) => pitchDepth.connect(o.detune));

  [pitchLfo, ampLfo, bloom, ...voices].forEach((n) => n.start());

  let f0 = 220;
  let spread = 4;

  function setTimbre(d, angle, t, tau) {
    // Distance: soft centre → bright, wide, resonant rim.
    spread = 4 + 22 * d;
    bodyA.detune.setTargetAtTime(-spread, t, tau);
    bodyB.detune.setTargetAtTime(spread, t, tau);
    // Sawtooth and square share one detune so their mix stays coherent.
    saw.detune.setTargetAtTime(spread * 0.5, t, tau);
    square.detune.setTargetAtTime(spread * 0.5, t, tau);
    lowpass.frequency.setTargetAtTime(clamp(f0 * Math.pow(2, 2 + 3 * d), 200, 9000), t, tau);
    lowpass.Q.setTargetAtTime(0.7 + 3 * d * d, t, tau);
    brightLevel.gain.setTargetAtTime(0.2 + 0.45 * d, t, tau);
    // Angle (0 = right, π/2 = top): top sawtooth, bottom square;
    // left a dark formant near 700 Hz, right a nasal one near 2.4 kHz.
    const up = 0.5 + 0.5 * Math.sin(angle);
    const right = 0.5 + 0.5 * Math.cos(angle);
    sawMix.gain.setTargetAtTime(0.15 + 0.6 * up, t, tau);
    squareMix.gain.setTargetAtTime(0.15 + 0.6 * (1 - up), t, tau);
    formant.frequency.setTargetAtTime(700 * Math.pow(2, 1.8 * right), t, tau);
  }

  return {
    /** Start a hold at fundamental f (Hz), position (d 0..1, angle rad). */
    hold(f, d = 0, angle = 0) {
      const t = ctx.currentTime;
      f0 = f;
      voices.forEach((o) => {
        o.frequency.cancelScheduledValues(t);
        o.frequency.setTargetAtTime(o === bodyB ? f0 * 2 : f0, t, 0.2);
      });
      setTimbre(d, angle, t, 0.02);
      swellGain.gain.cancelScheduledValues(t);
      swellGain.gain.setTargetAtTime(SWELL_LEVEL, t, SWELL_TAU);
      bloom.offset.cancelScheduledValues(t);
      bloom.offset.setTargetAtTime(1, t, BLOOM_TAU);
    },

    /** Keep the swell up (after an interruption) without restarting the bloom. */
    sustain() {
      swellGain.gain.setTargetAtTime(SWELL_LEVEL, ctx.currentTime, SWELL_TAU);
    },

    /**
     * Follow the finger: position sets the timbre, distance and motion
     * energy (0..1) set the vibrato as before.
     */
    shape(d, angle, moveEnergy = 0) {
      const t = ctx.currentTime;
      setTimbre(d, angle, t, 0.08);
      pitchDepth.gain.setTargetAtTime(BASE_PITCH_CENTS + d * 14 + moveEnergy * 18, t, 0.04);
      ampDepth.gain.setTargetAtTime(BASE_AMP_DEPTH + d * 0.1 + moveEnergy * 0.12, t, 0.04);
      pitchLfo.frequency.setTargetAtTime(5 + d * 2 + moveEnergy * 3, t, 0.06);
    },

    release() {
      const t = ctx.currentTime;
      swellGain.gain.cancelScheduledValues(t);
      swellGain.gain.setTargetAtTime(0, t, RELEASE_TAU);
      bloom.offset.cancelScheduledValues(t);
      bloom.offset.setTargetAtTime(0, t, RELEASE_TAU * 1.5);
      pitchDepth.gain.setTargetAtTime(BASE_PITCH_CENTS, t, 0.1);
      ampDepth.gain.setTargetAtTime(BASE_AMP_DEPTH, t, 0.1);
    },
  };
}
