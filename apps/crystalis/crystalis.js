import { bindLearn, setStatus, startAudio } from "../../shared/app.js";
import { renderQrCanvas } from "../../shared/qr.js";
import {
  CRYSTALIS_BASE,
  D,
  L,
  NOTE_KEYS,
  R,
  U,
  createChannelPool,
  degreeForCharCode,
  gridAt,
  pitchMidi,
  pluckGainAt,
} from "../../shared/crystalis-engine.js";

bindLearn();

const params = new URLSearchParams(location.search);
const syncStartParam = params.get("sync");
let syncStartMs = syncStartParam ? parseInt(syncStartParam, 10) : 0;

let ctx = null;
let master = null;
let pool = null;
let register = 3;
let level = 1;
let pluckMode = false;
let lastCellIndex = -1;

const held = new Map();
const keyDown = new Set();

const readout = document.getElementById("readout");
const modeBtn = document.getElementById("modeBtn");
const gridEl = document.getElementById("grid");
const bowPad = document.getElementById("bowPad");
const keysEl = document.getElementById("keys");
const playView = document.getElementById("playView");
const hostView = document.getElementById("hostView");
const tabPlay = document.getElementById("tabPlay");
const tabHost = document.getElementById("tabHost");

function buildGrid() {
  gridEl.innerHTML = "";
  for (let i = 0; i < 32; i++) {
    const c = document.createElement("div");
    c.className = "cry-cell";
    gridEl.appendChild(c);
  }
}

function buildKeys() {
  keysEl.innerHTML = "";
  for (const ch of NOTE_KEYS) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cry-key";
    btn.textContent = ch;
    btn.dataset.ch = ch;
    const down = (e) => {
      e.preventDefault();
      noteOn(ch.charCodeAt(0));
    };
    const up = (e) => {
      e.preventDefault();
      noteOff(ch.charCodeAt(0));
    };
    btn.addEventListener("pointerdown", down);
    btn.addEventListener("pointerup", up);
    btn.addEventListener("pointercancel", up);
    keysEl.appendChild(btn);
  }
}

function updateReadout() {
  readout.textContent = `${pluckMode ? "Pluck" : "Bow"} · reg ${register} · vol ${level.toFixed(2)} · held ${held.size}`;
}

function ensureAudio() {
  void startAudio((c) => {
    if (ctx) return;
    ctx = c;
    master = ctx.createGain();
    master.gain.value = level * 0.04;
    master.connect(ctx.destination);
    pool = createChannelPool(ctx, master);
    if (!syncStartMs) syncStartMs = Date.now() + 400;
    gridEl.hidden = !pluckMode;
    loop();
  });
}

function noteOn(code) {
  const deg = degreeForCharCode(code);
  if (deg < 0 || held.has(code)) return;
  ensureAudio();
  const band = pool.findNext(code);
  if (!band) return;
  const midi = pitchMidi(register, deg);
  band.setPitchFromMidi(midi);
  if (!pluckMode) band.startBow();
  held.set(code, band);
  keyDown.add(code);
  keysEl.querySelector(`[data-ch="${String.fromCharCode(code)}"]`)?.classList.add("down");
  updateReadout();
}

function noteOff(code) {
  const band = held.get(code);
  if (band) {
    if (!pluckMode) band.stopBow();
    band.stop();
  }
  held.delete(code);
  if (pool) pool.freeByKey(code);
  keyDown.delete(code);
  keysEl.querySelector(`[data-ch="${String.fromCharCode(code)}"]`)?.classList.remove("down");
  updateReadout();
}

function setLevel(val) {
  level = Math.max(0.2, Math.min(2, val));
  if (master) master.gain.value = level * 0.04;
  updateReadout();
}

modeBtn.onclick = () => {
  pluckMode = !pluckMode;
  modeBtn.textContent = pluckMode ? "Pluck" : "Bow";
  modeBtn.classList.toggle("active", !pluckMode);
  gridEl.hidden = !pluckMode;
  for (const code of [...held.keys()]) noteOff(code);
  updateReadout();
};

document.getElementById("regDown").onclick = () => {
  if (register > 0) register--;
  document.getElementById("regVal").textContent = String(register);
  updateReadout();
};
document.getElementById("regUp").onclick = () => {
  if (register < 6) register++;
  document.getElementById("regVal").textContent = String(register);
  updateReadout();
};
document.getElementById("volDown").onclick = () => setLevel(level * 0.95);
document.getElementById("volUp").onclick = () => setLevel(level * 1.05);

let lastX = 0;
let lastY = 0;
let padActive = false;

bowPad.addEventListener("pointerdown", (e) => {
  e.preventDefault();
  ensureAudio();
  padActive = true;
  bowPad.setPointerCapture(e.pointerId);
  bowPad.classList.add("active");
  lastX = e.clientX;
  lastY = e.clientY;
});

bowPad.addEventListener("pointermove", (e) => {
  if (!padActive || pluckMode) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;
  if (!pool) return;
  const amt = (n) => Math.min(1, n * 0.08);
  if (dx < 0) for (const b of pool.active()) b.bowImpulse(L, amt(-dx));
  else if (dx > 0) for (const b of pool.active()) b.bowImpulse(R, amt(dx));
  if (dy < 0) for (const b of pool.active()) b.bowImpulse(D, amt(-dy));
  else if (dy > 0) for (const b of pool.active()) b.bowImpulse(U, amt(dy));
});

const endPad = (e) => {
  if (e && padActive && e.pointerId !== undefined) {
    try {
      if (bowPad.hasPointerCapture(e.pointerId)) bowPad.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }
  padActive = false;
  bowPad.classList.remove("active");
};
bowPad.addEventListener("pointerup", endPad);
bowPad.addEventListener("pointercancel", endPad);

function highlightGrid(x, y) {
  const cells = gridEl.children;
  cells.forEach((c) => c.classList.remove("on"));
  const idx = y * 8 + x;
  if (cells[idx]) cells[idx].classList.add("on");
}

function onPluckTick(x, y) {
  const g = pluckGainAt(x, y);
  highlightGrid(x, y);
  if (!pool || !pluckMode) return;
  for (const band of pool.active()) band.pluck(g);
}

function loop() {
  if (!ctx) return;
  const { x, y, index } = gridAt(syncStartMs, ctx);
  if (index !== lastCellIndex) {
    lastCellIndex = index;
    if (pluckMode) onPluckTick(x, y);
  }
  requestAnimationFrame(loop);
}

window.addEventListener(
  "keydown",
  (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.length === 1) {
      const code = e.key.charCodeAt(0);
      if (degreeForCharCode(code) >= 0) {
        e.preventDefault();
        if (!keyDown.has(code)) noteOn(code);
      }
    }
  },
  { capture: true }
);
window.addEventListener(
  "keyup",
  (e) => {
    if (e.key.length === 1) {
      const code = e.key.charCodeAt(0);
      if (degreeForCharCode(code) >= 0) {
        e.preventDefault();
        noteOff(code);
      }
    }
  },
  { capture: true }
);

buildGrid();
buildKeys();
updateReadout();

tabPlay.onclick = () => {
  playView.classList.remove("hidden");
  hostView.classList.add("hidden");
  tabPlay.classList.add("active");
  tabHost.classList.remove("active");
};
tabHost.onclick = () => {
  playView.classList.add("hidden");
  hostView.classList.remove("hidden");
  tabHost.classList.add("active");
  tabPlay.classList.remove("active");
};

function buildMusicianUrl(startMs) {
  const u = new URL(location.href);
  u.searchParams.set("sync", String(startMs));
  return u.toString();
}

document.getElementById("hostStart").onclick = () => {
  const startMs = Date.now() + 5000;
  syncStartMs = startMs;
  lastCellIndex = -1;
  pluckMode = true;
  modeBtn.textContent = "Pluck";
  gridEl.hidden = false;
  const url = buildMusicianUrl(startMs);
  document.getElementById("sharePanel").classList.remove("hidden");
  document.getElementById("musicianLink").textContent = url;
  renderQrCanvas(document.getElementById("shareQr"), url, { scale: 4, border: 2 });
  document.getElementById("copyBtn").classList.remove("hidden");
  setStatus("hostStatus", "Pluck mode · share link", "ok");
  ensureAudio();
};

document.getElementById("copyBtn").onclick = async () => {
  try {
    await navigator.clipboard.writeText(document.getElementById("musicianLink").textContent);
    setStatus("hostStatus", "Copied", "ok");
  } catch {
    setStatus("hostStatus", "Copy manually", "warn");
  }
};

document.body.addEventListener("pointerdown", () => ensureAudio(), { once: true, capture: true });

if (params.has("host")) document.getElementById("tabHost").click();
if (syncStartParam) {
  pluckMode = true;
  modeBtn.textContent = "Pluck";
  gridEl.hidden = false;
}
