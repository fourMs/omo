/* piano.js – Web Audio piano (three octaves, mobile touch) */

import { bindLearn, startAudio } from '../../shared/app.js';
import { getAppOutput } from '../../shared/audio.js';

bindLearn();

(function () {
  'use strict';
  let ctx = null;
  let masterGain = null;
  let reverbNode = null;
  let reverbGain = null;
  let dryGain = null;

  const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const BLACK_SEMIS = new Set([1, 3, 6, 8, 10]);
  const KEY_BY_SEMI = { 0: 'a', 1: 'w', 2: 's', 3: 'e', 4: 'd', 5: 'f', 6: 't', 7: 'g', 8: 'y', 9: 'h', 10: 'u', 11: 'j' };
  const OCTAVES_ON_KEYBOARD = 3;
  /** Extra top C so each visible octave can run C→C (C4–C7). */
  const TOP_C_EXTRA = 1;
  const RELEASE_SEC = 0.1;
  const ATTACK_SEC = 0.012;

  const volumeSlider = document.getElementById('volume');
  const reverbSlider = document.getElementById('reverb');
  const waveformSelect = document.getElementById('waveform');
  const keyboard = document.getElementById('keyboard');
  const octaveDisplay = document.getElementById('octave-display');
  const slideModeEl = document.getElementById('slideMode');

  const WHITE_W = 28; // key 27px + 1px gap — C4–C7 with horizontal scroll
  const BLACK_NUDGE = 20;

  function ensureCtx() {
    void startAudio(!ctx ? (c) => { ctx = c; buildReverb(); } : undefined);
  }

  document.body.addEventListener('pointerdown', () => {
    ensureCtx();
  }, { once: true, capture: true });

  function buildReverb() {
    masterGain = ctx.createGain();
    masterGain.gain.value = parseFloat(volumeSlider.value);
    masterGain.connect(getAppOutput(ctx));

    const rate = ctx.sampleRate;
    const length = rate * 2.5;
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = impulse.getChannelData(ch);
      for (let i = 0; i < length; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 3);
      }
    }

    reverbNode = ctx.createConvolver();
    reverbNode.buffer = impulse;
    reverbGain = ctx.createGain();
    dryGain = ctx.createGain();
    const wet = parseFloat(reverbSlider.value);
    reverbGain.gain.value = wet;
    dryGain.gain.value = 1 - wet * 0.5;
    reverbNode.connect(reverbGain);
    reverbGain.connect(masterGain);
    dryGain.connect(masterGain);
  }

  function buildNoteDefs() {
    const defs = [];
    const totalSemis = OCTAVES_ON_KEYBOARD * 12 + TOP_C_EXTRA;
    for (let semi = 0; semi < totalSemis; semi++) {
      const inOct = semi % 12;
      const octNum = 4 + Math.floor(semi / 12);
      defs.push({
        name: `${NOTE_NAMES[inOct]}${octNum}`,
        semi,
        black: BLACK_SEMIS.has(inOct),
        key: semi < 12 ? KEY_BY_SEMI[inOct] : null,
      });
    }
    return defs;
  }

  const NOTE_DEFS = buildNoteDefs();
  const C4_FREQ = 261.63;

  function noteFreq(semiOffset, octaveShift) {
    return C4_FREQ * Math.pow(2, (semiOffset + octaveShift * 12) / 12);
  }

  let octave = 4;
  const octaveShift = () => octave - 4;

  document.getElementById('octave-down').addEventListener('click', () => {
    if (octave > 1) { octave--; octaveDisplay.textContent = octave; }
  });
  document.getElementById('octave-up').addEventListener('click', () => {
    if (octave < 7) { octave++; octaveDisplay.textContent = octave; }
  });

  volumeSlider.addEventListener('input', () => {
    if (masterGain) masterGain.gain.value = parseFloat(volumeSlider.value);
  });

  reverbSlider.addEventListener('input', () => {
    if (reverbGain) {
      const wet = parseFloat(reverbSlider.value);
      reverbGain.gain.value = wet;
      dryGain.gain.value = 1 - wet * 0.5;
    }
  });

  function blackKeyLeft(semi) {
    const inOct = semi % 12;
    const oct = Math.floor(semi / 12);
    const whiteBefore = { 1: 0, 3: 1, 6: 3, 8: 4, 10: 5 }[inOct];
    return oct * 7 * WHITE_W + whiteBefore * WHITE_W + BLACK_NUDGE;
  }

  const keyMap = {};
  const activeVoices = {};
  const heldSemis = new Set();
  const pointerNotes = new Map();
  const pointerVoices = new Map();
  let slideVoice = null;
  let slidePointerId = null;
  let slideSemi = null;

  function clamp(v, lo, hi) {
    return Math.min(hi, Math.max(lo, v));
  }

  function semiFromClientX(clientX) {
    const rect = keyboard.getBoundingClientRect();
    if (rect.width <= 0) return 0;
    const nx = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(nx * (NOTE_DEFS.length - 1));
  }

  /** Nearest chromatic key under the finger (black keys included). */
  function semiFromPointer(clientX, clientY) {
    const hit = document.elementFromPoint(clientX, clientY);
    const key = hit?.closest?.('.piano-key');
    if (key) return parseInt(key.dataset.semi, 10);
    return semiFromClientX(clientX);
  }

  function setKeyActive(semi, on) {
    const el = keyboard.querySelector(`.piano-key[data-semi="${semi}"]`);
    if (el) el.classList.toggle('active', on);
  }

  function createVoice(freq) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = waveformSelect.value;
    osc.frequency.setValueAtTime(freq, t);
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(0.75, t + ATTACK_SEC);
    env.gain.linearRampToValueAtTime(0.35, t + ATTACK_SEC + 0.1);
    osc.connect(env);
    env.connect(dryGain);
    env.connect(reverbNode);
    osc.start(t);
    return { osc, env };
  }

  function releaseVoice(voice) {
    if (!voice || voice.releasing) return;
    voice.releasing = true;
    const { osc, env } = voice;
    const t = ctx.currentTime;
    const stopAt = t + RELEASE_SEC + 0.02;
    env.gain.cancelScheduledValues(t);
    env.gain.setValueAtTime(Math.max(env.gain.value, 0.0001), t);
    env.gain.linearRampToValueAtTime(0, t + RELEASE_SEC);
    osc.stop(stopAt);
    setTimeout(() => {
      try {
        osc.disconnect();
        env.disconnect();
      } catch (_) { /* already disconnected */ }
    }, (RELEASE_SEC + 0.04) * 1000);
  }

  function trackVoice(pointerId, semi, voice) {
    pointerVoices.set(pointerId, { voice, semi });
    activeVoices[semi] = voice;
  }

  function untrackVoice(pointerId) {
    const pv = pointerVoices.get(pointerId);
    if (!pv) return;
    if (activeVoices[pv.semi] === pv.voice) delete activeVoices[pv.semi];
    pointerVoices.delete(pointerId);
  }

  function glideVoice(voice, semi) {
    voice.osc.frequency.setTargetAtTime(
      noteFreq(semi, octaveShift()),
      ctx.currentTime,
      0.008
    );
  }

  function updateSlideHighlight(semi) {
    keyboard.querySelectorAll('.piano-key').forEach((el) => {
      el.classList.toggle('active', parseInt(el.dataset.semi, 10) === semi);
    });
  }

  function clearSlideHighlight() {
    keyboard.querySelectorAll('.piano-key.active').forEach((el) => el.classList.remove('active'));
  }

  function chromaticMove(pointerId, clientX, clientY, legato) {
    const newSemi = semiFromPointer(clientX, clientY);
    const oldSemi = pointerNotes.get(pointerId);
    if (oldSemi === newSemi) return;

    if (legato && slideVoice) {
      slideSemi = newSemi;
      slideVoice.osc.frequency.setTargetAtTime(
        noteFreq(newSemi, octaveShift()),
        ctx.currentTime,
        0.008
      );
      updateSlideHighlight(newSemi);
      pointerNotes.set(pointerId, newSemi);
      return;
    }

    const pv = pointerVoices.get(pointerId);
    if (pv && pv.semi === newSemi) return;

    if (pv) {
      setKeyActive(pv.semi, false);
      if (activeVoices[pv.semi] === pv.voice) delete activeVoices[pv.semi];
      pv.semi = newSemi;
      activeVoices[newSemi] = pv.voice;
      glideVoice(pv.voice, newSemi);
    } else {
      const voice = createVoice(noteFreq(newSemi, octaveShift()));
      trackVoice(pointerId, newSemi, voice);
    }

    pointerNotes.set(pointerId, newSemi);
    if (oldSemi != null) heldSemis.delete(oldSemi);
    heldSemis.add(newSemi);
    setKeyActive(newSemi, true);
  }

  function releasePointer(pointerId) {
    const semi = pointerNotes.get(pointerId);
    if (semi == null) return;
    const pv = pointerVoices.get(pointerId);
    if (pv) {
      releaseVoice(pv.voice);
      untrackVoice(pointerId);
    } else {
      stopNote(semi);
    }
    heldSemis.delete(semi);
    setKeyActive(semi, false);
    pointerNotes.delete(pointerId);
  }

  function startSlide(semi) {
    ensureCtx();
    stopSlide();
    slideSemi = semi;
    pointerNotes.set(slidePointerId, semi);
    slideVoice = createVoice(noteFreq(semi, octaveShift()));
    updateSlideHighlight(semi);
  }

  function stopSlide() {
    if (slideVoice) {
      releaseVoice(slideVoice);
      slideVoice = null;
    }
    if (slidePointerId != null) {
      pointerNotes.delete(slidePointerId);
    }
    slideSemi = null;
    clearSlideHighlight();
  }

  function bindSlideMode() {
    keyboard.addEventListener('pointerdown', (e) => {
      if (!slideModeEl.checked) return;
      e.preventDefault();
      ensureCtx();
      slidePointerId = e.pointerId;
      keyboard.setPointerCapture(e.pointerId);
      startSlide(semiFromPointer(e.clientX, e.clientY));
    });

    keyboard.addEventListener('pointermove', (e) => {
      if (!slideModeEl.checked || e.pointerId !== slidePointerId) return;
      e.preventDefault();
      chromaticMove(e.pointerId, e.clientX, e.clientY, true);
    });

    const endSlide = (e) => {
      if (!slideModeEl.checked || e.pointerId !== slidePointerId) return;
      if (keyboard.hasPointerCapture(e.pointerId)) {
        keyboard.releasePointerCapture(e.pointerId);
      }
      slidePointerId = null;
      stopSlide();
    };

    keyboard.addEventListener('pointerup', endSlide);
    keyboard.addEventListener('pointercancel', endSlide);
    keyboard.addEventListener('lostpointercapture', () => {
      slidePointerId = null;
      stopSlide();
    });
  }

  slideModeEl.addEventListener('change', () => {
    stopSlide();
  });

  keyboard.style.touchAction = 'none';

  function bindKey(el, semi) {
    el.addEventListener('pointerdown', (e) => {
      if (slideModeEl.checked) return;
      e.preventDefault();
      ensureCtx();
      if (heldSemis.has(semi)) return;
      heldSemis.add(semi);
      pointerNotes.set(e.pointerId, semi);
      el.setPointerCapture(e.pointerId);
      const voice = createVoice(noteFreq(semi, octaveShift()));
      trackVoice(e.pointerId, semi, voice);
      el.classList.add('active');
    });

    el.addEventListener('pointermove', (e) => {
      if (slideModeEl.checked || !el.hasPointerCapture(e.pointerId)) return;
      e.preventDefault();
      chromaticMove(e.pointerId, e.clientX, e.clientY, false);
    });

    const release = (e) => {
      if (e && e.pointerId != null && el.hasPointerCapture(e.pointerId)) {
        el.releasePointerCapture(e.pointerId);
      }
      releasePointer(e.pointerId);
    };

    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
    el.addEventListener('lostpointercapture', (e) => {
      releasePointer(e.pointerId);
    });
  }

  function buildKeyboard() {
    keyboard.innerHTML = '';
    NOTE_DEFS.forEach((def) => {
      const el = document.createElement('div');
      el.classList.add('piano-key', def.black ? 'black' : 'white');
      el.dataset.semi = def.semi;

      const noteLabel = document.createElement('span');
      noteLabel.className = 'key-note';
      noteLabel.textContent = def.name;
      el.appendChild(noteLabel);

      if (def.key) {
        const keyLabel = document.createElement('span');
        keyLabel.className = 'key-label';
        keyLabel.textContent = def.key.toUpperCase();
        el.appendChild(keyLabel);
        keyMap[def.key] = el;
      }

      if (def.black) {
        el.style.left = `${blackKeyLeft(def.semi)}px`;
      }

      bindKey(el, def.semi);
      keyboard.appendChild(el);
    });
  }

  buildKeyboard();
  bindSlideMode();

  function playNote(semi) {
    ensureCtx();
    if (activeVoices[semi]) return;
    activeVoices[semi] = createVoice(noteFreq(semi, octaveShift()));
  }

  function stopNote(semi) {
    const voice = activeVoices[semi];
    if (!voice) return;
    releaseVoice(voice);
    delete activeVoices[semi];
  }

  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const key = e.key.toLowerCase();
    const el = keyMap[key];
    if (!el) return;
    const semi = parseInt(el.dataset.semi, 10);
    if (heldSemis.has(semi)) return;
    heldSemis.add(semi);
    ensureCtx();
    playNote(semi);
    el.classList.add('active');
  });

  document.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    const el = keyMap[key];
    if (!el) return;
    const semi = parseInt(el.dataset.semi, 10);
    heldSemis.delete(semi);
    el.classList.remove('active');
    stopNote(semi);
  });
}());
