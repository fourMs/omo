/* drums.js – Web Audio drum machine */

import { bindLearn, startAudio } from '../../shared/app.js';

bindLearn();

(function () {
  'use strict';

  let ctx = null;
  let masterGain = null;

  const volumeSlider = document.getElementById('volume');

  function ensureCtx() {
    void startAudio(!ctx ? (c) => {
      ctx = c;
      masterGain = ctx.createGain();
      masterGain.gain.value = parseFloat(volumeSlider.value);
      masterGain.connect(ctx.destination);
    } : undefined);
  }

  document.body.addEventListener('pointerdown', () => {
    ensureCtx();
  }, { once: true, capture: true });

  volumeSlider.addEventListener('input', () => {
    if (masterGain) masterGain.gain.value = parseFloat(volumeSlider.value);
  });

  // ── Drum sound definitions ──────────────────────────────────────────────────
  const PADS = [
    { name: 'Kick',     icon: '💥', key: '1', play: playKick },
    { name: 'Snare',    icon: '🥁', key: '2', play: playSnare },
    { name: 'Hi-Hat',   icon: '🔔', key: '3', play: playClosedHiHat },
    { name: 'Open Hat', icon: '🔓', key: '4', play: playOpenHiHat },
    { name: 'Tom 1',    icon: '🟤', key: '5', play: playTom1 },
    { name: 'Tom 2',    icon: '🟠', key: '6', play: playTom2 },
    { name: 'Clap',     icon: '👏', key: '7', play: playClap },
    { name: 'Cowbell',  icon: '🔔', key: '8', play: playCowbell },
  ];

  // ── Sound synthesis helpers ─────────────────────────────────────────────────

  function playKick() {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    env.gain.setValueAtTime(1, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(env);
    env.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }

  function playSnare() {
    const osc = ctx.createOscillator();
    const oscEnv = ctx.createGain();
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    oscEnv.gain.setValueAtTime(0.5, ctx.currentTime);
    oscEnv.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(oscEnv);
    oscEnv.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);

    const bufLen = ctx.sampleRate * 0.2;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const noiseEnv = ctx.createGain();
    noiseEnv.gain.setValueAtTime(1, ctx.currentTime);
    noiseEnv.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1000;
    noise.connect(hp);
    hp.connect(noiseEnv);
    noiseEnv.connect(masterGain);
    noise.start();
    noise.stop(ctx.currentTime + 0.2);
  }

  function playClosedHiHat() {
    playHiHat(0.05);
  }

  function playOpenHiHat() {
    playHiHat(0.35);
  }

  function playHiHat(duration) {
    const bufLen = ctx.sampleRate * duration;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 7000;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0.6, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    noise.connect(hp);
    hp.connect(env);
    env.connect(masterGain);
    noise.start();
    noise.stop(ctx.currentTime + duration);
  }

  function playTom(freq, duration) {
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, ctx.currentTime + duration);
    env.gain.setValueAtTime(0.9, ctx.currentTime);
    env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(env);
    env.connect(masterGain);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  function playTom1() { playTom(180, 0.3); }
  function playTom2() { playTom(120, 0.35); }

  function playClap() {
    [0, 0.01, 0.02].forEach((offset) => {
      const bufLen = Math.floor(ctx.sampleRate * 0.05);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1200;
      bp.Q.value = 0.5;
      const env = ctx.createGain();
      const startTime = ctx.currentTime + offset;
      env.gain.setValueAtTime(0.8, startTime);
      env.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
      noise.connect(bp);
      bp.connect(env);
      env.connect(masterGain);
      noise.start(startTime);
      noise.stop(startTime + 0.1);
    });
  }

  function playCowbell() {
    [562, 845].forEach((freq) => {
      const osc = ctx.createOscillator();
      osc.type = 'square';
      osc.frequency.value = freq;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = freq;
      bp.Q.value = 5;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0.5, ctx.currentTime);
      env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      osc.connect(bp);
      bp.connect(env);
      env.connect(masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.6);
    });
  }

  const grid = document.getElementById('pads-grid');
  const keyToPad = {};

  PADS.forEach((pad, i) => {
    const el = document.createElement('div');
    el.className = 'drum-pad';
    el.dataset.pad = i;
    el.innerHTML = `
      <span class="pad-icon">${pad.icon}</span>
      <span class="pad-name">${pad.name}</span>
      <span class="pad-key">${pad.key}</span>
    `;

    el.addEventListener('mousedown', (e) => {
      e.preventDefault();
      triggerPad(i, el);
    });
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      ensureCtx();
      triggerPad(i, el);
    });

    grid.appendChild(el);
    keyToPad[pad.key] = { index: i, el, play: pad.play };
  });

  function triggerPad(i, el) {
    ensureCtx();
    PADS[i].play();
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 120);
  }

  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const entry = keyToPad[e.key];
    if (!entry) return;
    triggerPad(entry.index, entry.el);
  });
}());
