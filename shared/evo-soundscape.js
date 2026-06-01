/**
 * Evolving ensemble soundscape — chroma consensus drones + entrainment rhythm.
 * Combines harmony-sync, pulse-sync, and lightweight GA over voicing + patterns.
 */

import { midiToHz } from "./pitch.js";
import { EVO_REST, EVO_STEPS, quantizeHits } from "./evo-pattern.js";
import { createFireflyPulse } from "./pulse-sync.js";
import { createHarmonyConsensus } from "./harmony-sync.js";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** Rhythm gene: REST | soft click | noise tick | chord ping */
export const SC_REST = 0;
export const SC_CLICK = 1;
export const SC_TICK = 2;
export const SC_PING = 3;
export const SC_MAX = 4;

export function randomRhythmGenes(rand = Math.random) {
  const g = new Uint8Array(EVO_STEPS);
  for (let i = 0; i < EVO_STEPS; i++) {
    const r = rand();
    if (r < 0.62) g[i] = SC_REST;
    else if (r < 0.82) g[i] = SC_CLICK;
    else if (r < 0.94) g[i] = SC_TICK;
    else g[i] = SC_PING;
  }
  return g;
}

/** @typedef {{ rhythm: Uint8Array, droneMask: Uint8Array, register: number, timbre: number }} SoundscapeGenes */

/**
 * @param {SoundscapeGenes} genes
 * @param {Float32Array} chromaView
 * @param {number} rootPc
 * @param {boolean} isMajor
 * @param {number} pulseLock 0–1
 * @param {Uint8Array | null} heardRhythm
 */
export function soundscapeFitness(genes, chromaView, rootPc, isMajor, pulseLock, heardRhythm = null) {
  const third = isMajor ? 4 : 3;
  const pcs = [];
  if (genes.droneMask[0]) pcs.push(rootPc);
  if (genes.droneMask[1]) pcs.push((rootPc + third) % 12);
  if (genes.droneMask[2]) pcs.push((rootPc + 7) % 12);
  if (genes.droneMask[3]) pcs.push((rootPc + 10) % 12);
  if (genes.droneMask[4]) pcs.push((rootPc + 2) % 12);

  let consonance = 0;
  for (const pc of pcs) consonance += chromaView[pc];
  consonance -= chromaView[(rootPc + 6) % 12] * 0.45;
  if (!pcs.length) consonance -= 0.2;

  let hits = 0;
  for (let i = 0; i < EVO_STEPS; i++) if (genes.rhythm[i] !== SC_REST) hits++;
  const sparsity = hits >= 2 && hits <= 6 ? 1 : hits < 2 ? hits * 0.35 : Math.max(0, 1 - (hits - 6) * 0.18);

  let rhythmFit = 0.35;
  if (heardRhythm) {
    let match = 0;
    for (let i = 0; i < EVO_STEPS; i++) {
      const g = genes.rhythm[i] === SC_REST;
      const h = heardRhythm[i] === EVO_REST;
      if (g && h) match += 1;
      else if (!g && !h) match += 0.55;
    }
    rhythmFit = match / EVO_STEPS;
  }

  const variety = genes.timbre * 0.12 + genes.register * 0.08;
  return clamp(consonance * 0.42 + sparsity * 0.28 + rhythmFit * 0.18 + pulseLock * 0.12 + variety, 0, 1);
}

function randomSoundscapeGenes(rand = Math.random) {
  return {
    rhythm: randomRhythmGenes(rand),
    droneMask: Uint8Array.from([1, rand() > 0.35 ? 1 : 0, rand() > 0.4 ? 1 : 0, rand() > 0.55 ? 1 : 0, rand() > 0.7 ? 1 : 0]),
    register: (rand() * 3) | 0,
    timbre: rand(),
  };
}

function crossoverSoundscape(a, b, rand = Math.random) {
  const rhythm = new Uint8Array(EVO_STEPS);
  const point = 1 + ((rand() * (EVO_STEPS - 1)) | 0);
  for (let i = 0; i < EVO_STEPS; i++) rhythm[i] = i < point ? a.rhythm[i] : b.rhythm[i];
  const droneMask = Uint8Array.from(a.droneMask.map((v, i) => (rand() < 0.5 ? v : b.droneMask[i])));
  return {
    rhythm,
    droneMask,
    register: rand() < 0.5 ? a.register : b.register,
    timbre: rand() < 0.5 ? a.timbre : b.timbre,
  };
}

function mutateSoundscape(genes, rate, rand = Math.random) {
  for (let i = 0; i < EVO_STEPS; i++) {
    if (rand() < rate) genes.rhythm[i] = (rand() * SC_MAX) | 0;
  }
  for (let i = 0; i < genes.droneMask.length; i++) {
    if (rand() < rate * 0.6) genes.droneMask[i] = rand() < 0.55 ? 1 : 0;
  }
  if (rand() < rate) genes.register = (genes.register + 1 + ((rand() * 2) | 0)) % 3;
  if (rand() < rate) genes.timbre = clamp(genes.timbre + (rand() - 0.5) * 0.35, 0, 1);
}

function tournament(pop, rand) {
  let best = pop[(rand() * pop.length) | 0];
  for (let k = 0; k < 3; k++) {
    const c = pop[(rand() * pop.length) | 0];
    if (c.fitness > best.fitness) best = c;
  }
  return best;
}

/**
 * @param {{ genes: SoundscapeGenes, fitness: number }[]} population
 * @param {object} ctx fitness context
 */
export function evolveSoundscapeGeneration(population, ctx) {
  const { chromaView, rootPc, isMajor, pulseLock, heardRhythm, rand = Math.random } = ctx;
  population.forEach((ind) => {
    ind.fitness = soundscapeFitness(ind.genes, chromaView, rootPc, isMajor, pulseLock, heardRhythm);
  });
  population.sort((a, b) => b.fitness - a.fitness);
  const next = population.slice(0, 3).map((ind) => ({
    genes: {
      rhythm: Uint8Array.from(ind.genes.rhythm),
      droneMask: Uint8Array.from(ind.genes.droneMask),
      register: ind.genes.register,
      timbre: ind.genes.timbre,
    },
    fitness: ind.fitness,
  }));
  while (next.length < 18) {
    const p1 = tournament(population, rand);
    const p2 = tournament(population, rand);
    const child = crossoverSoundscape(p1.genes, p2.genes, rand);
    mutateSoundscape(child, 0.14, rand);
    next.push({
      genes: child,
      fitness: soundscapeFitness(child, chromaView, rootPc, isMajor, pulseLock, heardRhythm),
    });
  }
  next.sort((a, b) => b.fitness - a.fitness);
  return next;
}

export function createSoundscapePopulation(size, rand = Math.random) {
  return Array.from({ length: size }, () => {
    const genes = randomSoundscapeGenes(rand);
    return { genes, fitness: 0 };
  });
}

function playSoftClick(ctx, dest, t, level) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(640, t);
  o.frequency.exponentialRampToValueAtTime(280, t + 0.05);
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  o.connect(g);
  g.connect(dest);
  o.start(t);
  o.stop(t + 0.07);
}

function playNoiseTick(ctx, dest, t, level) {
  const len = Math.floor(ctx.sampleRate * 0.04);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const n = ctx.createBufferSource();
  n.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(level, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
  n.connect(hp);
  hp.connect(g);
  g.connect(dest);
  n.start(t);
  n.stop(t + 0.05);
}

function playChordPing(ctx, dest, t, hz, level) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = "triangle";
  o.frequency.value = hz;
  g.gain.setValueAtTime(0.001, t);
  g.gain.exponentialRampToValueAtTime(level, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  o.connect(g);
  g.connect(dest);
  o.start(t);
  o.stop(t + 0.22);
}

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} master
 * @param {object} opts
 */
export function createEvoSoundscapeEngine(ctx, master, opts = {}) {
  const droneBus = ctx.createGain();
  droneBus.gain.value = 0.38;
  const rhythmBus = ctx.createGain();
  rhythmBus.gain.value = 0.22;
  const droneFilter = ctx.createBiquadFilter();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 2400;
  droneFilter.Q.value = 0.7;
  droneBus.connect(droneFilter);
  droneFilter.connect(master);
  rhythmBus.connect(master);

  const consensus = createHarmonyConsensus({ startHz: 110 + (opts.registerSeed ?? 0) * 55 });
  const pulse = createFireflyPulse(ctx, rhythmBus, {
    bpm: opts.bpm ?? 68,
    level: 0.06,
    onPulse: (t, downbeat) => opts.onPulse?.(t, downbeat),
    onSync: (s) => opts.onSync?.(s),
  });

  const phoneSeed = opts.registerSeed ?? 0;
  const voices = [];
  for (let i = 0; i < 5; i++) {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const g = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoG = ctx.createGain();
    osc.type = i < 2 ? "sine" : "triangle";
    osc2.type = "sine";
    osc2.detune.value = 11 + i * 3;
    lfo.frequency.value = 0.05 + i * 0.02 + phoneSeed * 0.01;
    lfoG.gain.value = 3 + i;
    lfo.connect(lfoG);
    lfoG.connect(osc.detune);
    const mix = ctx.createGain();
    mix.gain.value = 0.5;
    osc.connect(mix);
    osc2.connect(mix);
    mix.connect(g);
    g.connect(droneBus);
    osc.start();
    osc2.start();
    lfo.start();
    voices.push({ osc, osc2, g, lfo, lfoG, voice: i });
  }

  let population = createSoundscapePopulation(18);
  let generation = 0;
  let activeGenes = population[0].genes;
  let heardRhythm = null;
  const heardHits = [];
  let running = false;
  let raf = 0;
  let stepIdx = 0;
  let lastStepTime = 0;
  let evolveCounter = 0;
  let ignoreOnsetUntil = 0;

  function chordForGenes() {
    const freqs = consensus.chordHz();
    const reg = activeGenes.register;
    const base = consensus.getRootMidi() - 12 + reg * 12 + phoneSeed * 7;
    const third = consensus.isMajor() ? 4 : 3;
    const hzList = [
      midiToHz(base),
      midiToHz(base + third),
      midiToHz(base + 7),
      midiToHz(base + 12),
      midiToHz(base + third + 12),
    ];
    if (freqs.length >= 3) {
      hzList[0] = freqs[0] * (0.5 + reg * 0.25);
      hzList[1] = freqs[1];
      hzList[2] = freqs[2];
    }
    return hzList;
  }

  function updateDrones() {
    const t = ctx.currentTime;
    const hzList = chordForGenes();
    const timbre = activeGenes.timbre;
    droneFilter.frequency.setTargetAtTime(900 + timbre * 4200, t, 0.4);
    voices.forEach((v, i) => {
      const on = activeGenes.droneMask[i] > 0;
      const target = on ? 0.07 + timbre * 0.04 : 0;
      v.g.gain.setTargetAtTime(target, t, 0.35);
      if (on) {
        v.osc.frequency.setTargetAtTime(hzList[i] || hzList[0], t, 0.25);
        v.osc2.frequency.setTargetAtTime((hzList[i] || hzList[0]) * 1.002, t, 0.25);
        v.lfo.frequency.setTargetAtTime(0.04 + timbre * 0.12 + i * 0.018, t, 0.5);
        v.lfoG.gain.setTargetAtTime(2 + timbre * 8, t, 0.5);
      }
    });
  }

  function playRhythmStep(step, t) {
    const hit = activeGenes.rhythm[step % EVO_STEPS];
    if (hit === SC_REST) return;
    const hz = consensus.getPlayHz();
    if (hit === SC_CLICK) playSoftClick(ctx, rhythmBus, t, 0.14);
    else if (hit === SC_TICK) playNoiseTick(ctx, rhythmBus, t, 0.1);
    else playChordPing(ctx, rhythmBus, t, hz * (step % 2 ? 1.5 : 1), 0.12);
    opts.onRhythm?.(t, hit);
  }

  function maybeEvolve(chromaView) {
    evolveCounter++;
    if (evolveCounter < 4) return;
    evolveCounter = 0;
    generation++;
    const rootPc = ((consensus.getRootMidi() % 12) + 12) % 12;
    const lock = consensus.lockAmount();
    population = evolveSoundscapeGeneration(population, {
      chromaView,
      rootPc,
      isMajor: consensus.isMajor(),
      pulseLock: lock,
      heardRhythm,
    });
    activeGenes = population[0].genes;
    updateDrones();
    opts.onEvolve?.({ generation, fitness: population[0].fitness, genes: activeGenes });
  }

  function tick() {
    if (!running) return;
    const now = ctx.currentTime;
    const bpm = pulse.getBpm();
    const stepDur = 60 / bpm / 4;
    while (lastStepTime + stepDur <= now + 0.02) {
      lastStepTime += stepDur;
      playRhythmStep(stepIdx, lastStepTime);
      stepIdx = (stepIdx + 1) % EVO_STEPS;
      if (stepIdx === 0) maybeEvolve(consensus.getChromaView());
    }
    raf = requestAnimationFrame(tick);
  }

  return {
    consensus,
    pulse,
    droneBus,
    rhythmBus,

    start() {
      if (running) return;
      running = true;
      stepIdx = 0;
      lastStepTime = ctx.currentTime;
      pulse.start();
      updateDrones();
      tick();
    },

    stop() {
      running = false;
      pulse.stop();
      cancelAnimationFrame(raf);
      const t = ctx.currentTime;
      voices.forEach((v) => v.g.gain.setTargetAtTime(0, t, 0.15));
    },

    ingestChroma(chroma, peakCount) {
      consensus.ingest(chroma, peakCount);
      updateDrones();
    },

    externalOnset(t, strength) {
      if (t < ignoreOnsetUntil) return;
      pulse.externalPulse(t, strength);
      heardHits.push({ t, pad: (strength * 4) | 0 });
      if (heardHits.length > 48) heardHits.shift();
      if (heardHits.length > 6) {
        const recent = heardHits.filter((h) => t - h.t < 4);
        if (recent.length >= 4) {
          const base = recent[0].t;
          heardRhythm = quantizeHits(
            recent.map((h) => ({ t: h.t - base, pad: h.pad % 4 })),
            pulse.getBpm()
          );
        }
      }
    },

    setIgnoreOnsetUntil(t) {
      ignoreOnsetUntil = t;
    },

    setBpm(bpm) {
      pulse.setBpm(bpm);
    },

    getState() {
      return {
        generation,
        fitness: population[0]?.fitness ?? 0,
        key: consensus.keyLabel(),
        bpm: pulse.getBpm(),
        lock: consensus.lockAmount(),
      };
    },

    getChromaView: () => consensus.getChromaView(),
    getRootPc: () => ((consensus.getRootMidi() % 12) + 12) % 12,
    nudgeEvolution() {
      generation++;
      population = evolveSoundscapeGeneration(population, {
        chromaView: consensus.getChromaView(),
        rootPc: ((consensus.getRootMidi() % 12) + 12) % 12,
        isMajor: consensus.isMajor(),
        pulseLock: consensus.lockAmount(),
        heardRhythm,
      });
      activeGenes = population[0].genes;
      updateDrones();
    },
  };
}
