/** Shared Web Audio drum synthesis for kit + sequencer apps. */

function playKick(ctx, out) {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  const t = ctx.currentTime;
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.exponentialRampToValueAtTime(0.001, t + 0.4);
  env.gain.setValueAtTime(1, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
  osc.connect(env);
  env.connect(out);
  osc.start(t);
  osc.stop(t + 0.4);
}

function playSnare(ctx, out) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const oscEnv = ctx.createGain();
  osc.frequency.setValueAtTime(200, t);
  osc.frequency.exponentialRampToValueAtTime(0.001, t + 0.15);
  oscEnv.gain.setValueAtTime(0.5, t);
  oscEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  osc.connect(oscEnv);
  oscEnv.connect(out);
  osc.start(t);
  osc.stop(t + 0.15);

  const bufLen = ctx.sampleRate * 0.2;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const noiseEnv = ctx.createGain();
  noiseEnv.gain.setValueAtTime(1, t);
  noiseEnv.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1000;
  noise.connect(hp);
  hp.connect(noiseEnv);
  noiseEnv.connect(out);
  noise.start(t);
  noise.stop(t + 0.2);
}

function playHiHat(ctx, out, duration) {
  const t = ctx.currentTime;
  const bufLen = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buf;
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7000;
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.6, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + duration);
  noise.connect(hp);
  hp.connect(env);
  env.connect(out);
  noise.start(t);
  noise.stop(t + duration);
}

function playTom(ctx, out, freq, duration) {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + duration);
  env.gain.setValueAtTime(0.9, t);
  env.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.connect(env);
  env.connect(out);
  osc.start(t);
  osc.stop(t + duration);
}

function playClap(ctx, out) {
  [0, 0.01, 0.02].forEach((offset) => {
    const bufLen = Math.floor(ctx.sampleRate * 0.05);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1200;
    bp.Q.value = 0.5;
    const env = ctx.createGain();
    const startTime = ctx.currentTime + offset;
    env.gain.setValueAtTime(0.8, startTime);
    env.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
    noise.connect(bp);
    bp.connect(env);
    env.connect(out);
    noise.start(startTime);
    noise.stop(startTime + 0.1);
  });
}

function playCowbell(ctx, out) {
  [562, 845].forEach((freq) => {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = freq;
    bp.Q.value = 5;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.5, t);
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    osc.connect(bp);
    bp.connect(env);
    env.connect(out);
    osc.start(t);
    osc.stop(t + 0.6);
  });
}

export const DRUM_KIT = [
  { id: "kick", name: "Kick", icon: "💥", key: "1", play: (ctx, out) => playKick(ctx, out) },
  { id: "snare", name: "Snare", icon: "🥁", key: "2", play: (ctx, out) => playSnare(ctx, out) },
  { id: "hat", name: "Hi-Hat", icon: "🔔", key: "3", play: (ctx, out) => playHiHat(ctx, out, 0.05) },
  { id: "openHat", name: "Open Hat", icon: "🔓", key: "4", play: (ctx, out) => playHiHat(ctx, out, 0.35) },
  { id: "tom1", name: "Tom 1", icon: "🟤", key: "5", play: (ctx, out) => playTom(ctx, out, 180, 0.3) },
  { id: "tom2", name: "Tom 2", icon: "🟠", key: "6", play: (ctx, out) => playTom(ctx, out, 120, 0.35) },
  { id: "clap", name: "Clap", icon: "👏", key: "7", play: (ctx, out) => playClap(ctx, out) },
  { id: "cowbell", name: "Cowbell", icon: "🐄", key: "8", play: (ctx, out) => playCowbell(ctx, out) },
];

export const DRUM_SEQ_ROWS = DRUM_KIT.slice(0, 4);

export function playDrum(id, ctx, out) {
  const pad = DRUM_KIT.find((p) => p.id === id);
  pad?.play(ctx, out);
}

export { playKick, playSnare };

/** @param {AudioContext} ctx @param {AudioNode} out */
export function playHat(ctx, out) {
  playHiHat(ctx, out, 0.05);
}
