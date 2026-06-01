/**
 * Web Audio helpers — iOS/Android safe unlock on first user gesture.
 */
export function createAudioContext() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) throw new Error("Web Audio not supported");
  return new Ctx();
}

let sharedCtx = null;

export function getAudioContext() {
  if (!sharedCtx) sharedCtx = createAudioContext();
  return sharedCtx;
}

/**
 * Resume suspended context (required on iOS). Call from click/touch handler.
 */
export async function unlockAudio(ctx = getAudioContext()) {
  if (ctx.state === "suspended") await ctx.resume();
  // Short silent blip — some iOS builds stay muted after resume() alone.
  try {
    const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start();
    src.stop();
  } catch {
    /* ignore */
  }
  return ctx;
}

export function midiToFreq(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Simple ADSR envelope on a gain node.
 */
export function applyEnvelope(gain, ctx, { attack = 0.02, decay = 0.1, sustain = 0.6, release = 0.3, peak = 0.8, when = ctx.currentTime }) {
  const g = gain.gain;
  g.cancelScheduledValues(when);
  g.setValueAtTime(0.001, when);
  g.exponentialRampToValueAtTime(peak, when + attack);
  g.exponentialRampToValueAtTime(Math.max(peak * sustain, 0.001), when + attack + decay);
  return {
    release(at = ctx.currentTime) {
      g.cancelScheduledValues(at);
      g.setValueAtTime(g.value, at);
      g.exponentialRampToValueAtTime(0.001, at + release);
    },
  };
}

let micPrimePromise = null;

/**
 * Start getUserMedia on the same user gesture (before any await). iOS Safari drops the
 * mic if getUserMedia runs after unlockAudio().
 */
export function primeMicStream() {
  if (!navigator.mediaDevices?.getUserMedia) return null;
  if (!micPrimePromise) {
    micPrimePromise = navigator.mediaDevices
      .getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false,
      })
      .catch((err) => {
        micPrimePromise = null;
        throw err;
      });
  }
  return micPrimePromise;
}

/** Mic stream from primeMicStream() or a fresh request. */
export async function getMicStream() {
  if (micPrimePromise) {
    const stream = await micPrimePromise;
    micPrimePromise = null;
    return stream;
  }
  return navigator.mediaDevices.getUserMedia({
    audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    video: false,
  });
}

/**
 * Mic → analyser (iOS needs a path to destination or levels stay at zero).
 */
export function connectMicAnalyser(ctx, stream, analyser, { inputGain = 1 } = {}) {
  const src = ctx.createMediaStreamSource(stream);
  let input = src;
  if (inputGain !== 1) {
    const boost = ctx.createGain();
    boost.gain.value = inputGain;
    src.connect(boost);
    input = boost;
  }
  input.connect(analyser);
  const silent = ctx.createGain();
  silent.gain.value = 0;
  analyser.connect(silent);
  silent.connect(ctx.destination);
  return src;
}

export function createMasterBus(ctx, volume = 0.7) {
  const master = ctx.createGain();
  master.gain.value = volume;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 3;
  master.connect(comp);
  comp.connect(ctx.destination);
  return { master, comp };
}
