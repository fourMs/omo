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
  dry.gain.value = 0.016;
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
  wet.gain.value = 0.06;
  rev.connect(wet);
  wet.connect(pan);

  const bow = createBowedString(ctx, dry);
  const ksPool = createKSPool(1);

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
  let lastImpulseAt = 0;
  let lastPluckAt = 0;
  let voiceScale = 1;
  const dryBase = 0.016;
  const wetBase = 0.06;

  function setPitchFromMidi(midi) {
    hz = midiToFreq(midi);
    bow.setPitch(hz);
  }

  return {
    channelIndex,
    setPitchFromMidi,
    setVoiceScale(scale) {
      voiceScale = Math.max(0.2, Math.min(1, scale));
      dry.gain.value = dryBase * voiceScale;
      wet.gain.value = wetBase * voiceScale;
    },
    startBow() {
      bowing = true;
      bow.setBow(0.09 * voiceScale);
    },
    stopBow() {
      bowing = false;
      bow.stop();
    },
    pluck(gain, levelScale = 1) {
      const now = performance.now();
      if (now - lastPluckAt < 85) return;
      lastPluckAt = now;
      const g = Math.max(0.05, Math.min(1, gain)) * levelScale * voiceScale;
      karplusPluck(ctx, dry, ksPool, hz, {
        strength: 0.12 + g * 0.22,
        level: 0.06 + g * 0.12,
        decaySec: 1.0 + g * 0.35,
        reverbBus: rev,
        reverbSend: 0.1,
      });
    },
    /** dir: L=0 R=1 U=2 D=3 — only this band's direction is wired. */
    bowImpulse(dir, amount) {
      if (dir !== channelIndex || amount < 0.02) return;
      const now = performance.now();
      if (now - lastImpulseAt < 110) return;
      lastImpulseAt = now;
      const t = ctx.currentTime;
      const a = Math.min(1, amount) * 0.018 * voiceScale;
      impGain.gain.cancelScheduledValues(t);
      impGain.gain.setValueAtTime(Math.max(0.0001, a), t);
      impGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      if (bowing) bow.setBow(0.06 + Math.min(0.16, amount * 0.04) * voiceScale);
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

  function refreshVoiceLevels() {
    const n = playing.size;
    const scale = n > 0 ? 1 / Math.sqrt(n) : 1;
    for (const i of playing.keys()) bands[i].setVoiceScale(scale);
  }

  function findNext(keyId) {
    current = (current + 1) % MAX_CHANNELS;
    for (let i = current; i < MAX_CHANNELS; i++) {
      if (!playing.has(i)) {
        playing.set(i, keyId);
        current = i;
        refreshVoiceLevels();
        return bands[i];
      }
    }
    for (let i = 0; i < current; i++) {
      if (!playing.has(i)) {
        playing.set(i, keyId);
        refreshVoiceLevels();
        return bands[i];
      }
    }
    return null;
  }

  function freeByKey(keyId) {
    for (const [idx, kid] of playing.entries()) {
      if (kid === keyId) {
        playing.delete(idx);
        refreshVoiceLevels();
        return bands[idx];
      }
    }
    return null;
  }

  return {
    bands,
    findNext,
    freeByKey,
    active: () => [...playing.keys()].map((i) => bands[i]),
    refreshVoiceLevels,
  };
}

/** Master bus tuned for dense bow/pluck layers. */
export function createCrystalisMasterBus(ctx, volume = 0.32) {
  const master = ctx.createGain();
  master.gain.value = volume;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -30;
  comp.knee.value = 8;
  comp.ratio.value = 14;
  comp.attack.value = 0.004;
  comp.release.value = 0.12;
  master.connect(comp);
  comp.connect(ctx.destination);
  return { master, comp };
}
