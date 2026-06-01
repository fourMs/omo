/**
 * Crystalis-style bowed bands + trackpad bowing (Ge Wang / SMELT crystalis.ck).
 */

import { midiToFreq } from "./audio.js";
import { createBowedString } from "./bowed-string.js";
import { createKSPool, karplusPluck } from "./ks.js";
import {
  GRID_H,
  GRID_W,
  SAMPLES_PER_CELL,
  cellDurationSec,
  gridAt,
} from "./clix-engine.js";

export { SAMPLES_PER_CELL, cellDurationSec, gridAt, GRID_W, GRID_H };

/** Pluck strengths from Crystalis server-local.ck (8×4 grid). */
export const CRYSTALIS_PLUCK_GAINS = [
  1.0, 0.5, 0.8, 0.4, 0.9, 0.6, 0.6, 0.5,
  0.7, 0.4, 0.8, 0.6, 0.9, 0.5, 0.5, 0.9,
  0.9, 0.5, 0.6, 0.5, 0.8, 0.6, 0.8, 0.5,
  0.5, 0.5, 0.8, 0.5, 1.0, 0.8, 0.5, 0.5,
];

export const CRYSTALIS_BASE = 12;
export const MAX_CHANNELS = 4;
export const L = 0;
export const R = 1;
export const U = 2;
export const D = 3;

/** Scale degrees 0…14 (crystalis.ck key map order). */
export const NOTE_KEYS = "asdfghjkl;'zxcvb".split("");

const KEY_DEGREE = new Map(NOTE_KEYS.map((ch, i) => [ch.charCodeAt(0), i]));

export function degreeForCharCode(code) {
  return KEY_DEGREE.get(code) ?? -1;
}

export function pitchMidi(register, degree) {
  return CRYSTALIS_BASE + register * 12 + degree;
}

export function pluckGainAt(x, y) {
  return CRYSTALIS_PLUCK_GAINS[y * GRID_W + x] ?? 0.5;
}

/**
 * One band: bowed string + directional impulse bow + reverb (per channel index).
 * @param {number} channelIndex 0…3 — L/R/U/D excitation path
 */
export function createCrystalisBand(ctx, dest, channelIndex) {
  const pan = ctx.createStereoPanner();
  const pans = [-0.85, -0.28, 0.28, 0.85];
  pan.pan.value = pans[channelIndex] ?? 0;
  pan.connect(dest);

  const dry = ctx.createGain();
  dry.gain.value = 0.04;
  dry.connect(pan);

  const rev = ctx.createConvolver();
  const len = Math.floor(ctx.sampleRate * 2);
  const impulse = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = impulse.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2;
  }
  rev.buffer = impulse;
  const wet = ctx.createGain();
  wet.gain.value = 0.2;
  rev.connect(wet);
  wet.connect(pan);

  const bow = createBowedString(ctx, dry);
  const ksPool = createKSPool(2);

  const impLp = ctx.createBiquadFilter();
  impLp.type = "lowpass";
  impLp.frequency.value = 120;
  const impPole = ctx.createBiquadFilter();
  impPole.type = "lowpass";
  impPole.frequency.value = 800;
  impPole.Q.value = 0.5;
  const impGain = ctx.createGain();
  impGain.gain.value = 0;
  impLp.connect(impPole);
  impPole.connect(impGain);
  impGain.connect(dry);

  let hz = 220;
  let bowing = false;

  function setPitchFromMidi(midi) {
    hz = midiToFreq(midi);
    bow.setPitch(hz);
  }

  return {
    channelIndex,
    setPitchFromMidi,
    startBow() {
      bowing = true;
      bow.setBow(0.35);
    },
    stopBow() {
      bowing = false;
      bow.release();
    },
    pluck(gain) {
      const g = Math.max(0.05, Math.min(1, gain));
      karplusPluck(ctx, dry, ksPool, hz, {
        strength: 0.35 + g * 0.45,
        level: 0.22 + g * 0.35,
        decaySec: 1.4 + g * 0.6,
        reverbBus: rev,
        reverbSend: 0.35,
      });
    },
    /** dir: L=0 R=1 U=2 D=3 — only this band's direction is wired. */
    bowImpulse(dir, amount) {
      if (dir !== channelIndex || amount < 0.001) return;
      const t = ctx.currentTime;
      const a = Math.min(1, amount) * 0.08;
      impGain.gain.cancelScheduledValues(t);
      impGain.gain.setValueAtTime(a, t);
      impGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      if (bowing) bow.setBow(0.25 + Math.min(0.7, amount * 0.15));
    },
    stop() {
      bowing = false;
      bow.stop();
    },
  };
}

export function createChannelPool(ctx, master) {
  const bands = [];
  for (let i = 0; i < MAX_CHANNELS; i++) bands.push(createCrystalisBand(ctx, master, i));
  const playing = new Map();
  let current = -1;

  function findNext(keyId) {
    current = (current + 1) % MAX_CHANNELS;
    for (let i = current; i < MAX_CHANNELS; i++) {
      if (!playing.has(i)) {
        playing.set(i, keyId);
        current = i;
        return bands[i];
      }
    }
    for (let i = 0; i < current; i++) {
      if (!playing.has(i)) {
        playing.set(i, keyId);
        return bands[i];
      }
    }
    return null;
  }

  function freeByKey(keyId) {
    for (const [idx, kid] of playing.entries()) {
      if (kid === keyId) {
        playing.delete(idx);
        return bands[idx];
      }
    }
    return null;
  }

  return { bands, findNext, freeByKey, active: () => [...playing.keys()].map((i) => bands[i]) };
}
