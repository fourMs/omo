import { bindLearn, isAudioActive, registerAudioBoot, setStatus, startAudio } from "../../shared/app.js";
import { createMasterBus } from "../../shared/audio.js";
import { renderQrCanvas } from "../../shared/qr.js";
import {
  GRID_H,
  GRID_W,
  createClixReverb,
  gainAt,
  gridAtTime,
  playClixNote,
} from "../../shared/clix-engine.js";

bindLearn();

const KEY_ROWS = [
  "1234567890",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

const params = new URLSearchParams(location.search);
const syncParam = params.get("sync");
let syncStartMs = syncParam ? parseInt(syncParam, 10) : Date.now();
if (!Number.isFinite(syncStartMs)) syncStartMs = Date.now();

let ctx = null;
let master = null;
let channelWhich = 0;
/** Keys currently held — retrigger on each grid pulse. */
const held = new Set();
let lastCellIndex = -1;
let loopRunning = false;
let cleared = false;

const gridEl = document.getElementById("grid");
const readout = document.getElementById("readout");
const keysEl = document.getElementById("keys");
const playView = document.getElementById("playView");
const hostView = document.getElementById("hostView");
const tabPlay = document.getElementById("tabPlay");
const tabHost = document.getElementById("tabHost");

function buildGrid() {
  gridEl.innerHTML = "";
  for (let y = 0; y < GRID_H; y++) {
    for (let x = 0; x < GRID_W; x++) {
      const cell = document.createElement("div");
      cell.className = "clix-cell";
      cell.dataset.x = String(x);
      cell.dataset.y = String(y);
      cell.title = `velocity ${gainAt(x, y).toFixed(1)}`;
      gridEl.appendChild(cell);
    }
  }
}

function buildKeys() {
  keysEl.innerHTML = "";
  for (const row of KEY_ROWS) {
    for (const ch of row) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clix-key";
      btn.textContent = ch;
      btn.dataset.ch = ch;
      const code = ch.charCodeAt(0);
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        void onKeyDown(code);
      });
      btn.addEventListener("pointerup", (e) => {
        e.preventDefault();
        onKeyUp(code);
      });
      btn.addEventListener("pointercancel", (e) => {
        onKeyUp(code);
      });
      keysEl.appendChild(btn);
    }
  }
}

function buildAudio(c) {
  ctx = c;
  const bus = createMasterBus(c, 0.75);
  master = createClixReverb(c, bus.master);
}

registerAudioBoot(buildAudio);

async function ensureAudio() {
  if (ctx && master) return ctx;
  return startAudio(buildAudio);
}

function setKeyVisual(code, down) {
  const ch = String.fromCharCode(code);
  keysEl.querySelector(`[data-ch="${ch}"]`)?.classList.toggle("down", down);
}

async function onKeyDown(code) {
  if (code < 32 || code > 126) return;
  if (held.has(code)) return;
  if (cleared) cleared = false;
  await ensureAudio();
  held.add(code);
  setKeyVisual(code, true);
  if (ctx && master) {
    const { x, y } = gridAtTime(syncStartMs, ctx.sampleRate);
    playClixNote(ctx, master, code, gainAt(x, y), channelWhich);
    channelWhich = (channelWhich + 1) % 2;
  }
  updateReadout();
}

function onKeyUp(code) {
  if (!held.delete(code)) return;
  setKeyVisual(code, false);
  updateReadout();
}

function updateReadout(x, y) {
  const gx = x ?? "—";
  const gy = y ?? "—";
  const g = x != null && y != null ? gainAt(x, y).toFixed(2) : "—";
  const audioHint = isAudioActive() ? "" : " · tap Audio on";
  readout.textContent = `grid ${gx},${gy} · vel ${g} · held ${held.size}${audioHint}`;
}

function highlightGrid(x, y) {
  gridEl.querySelectorAll(".clix-cell").forEach((c) => c.classList.remove("on"));
  const on = gridEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  if (on) on.classList.add("on");
}

function playHeldAtGrid(x, y) {
  if (!held.size || !ctx || !master) return;
  const vel = gainAt(x, y);
  for (const code of held) {
    playClixNote(ctx, master, code, vel, channelWhich);
    channelWhich = (channelWhich + 1) % 2;
  }
  updateReadout(x, y);
}

function loop() {
  if (!loopRunning) return;
  const sr = ctx?.sampleRate ?? 48000;
  const { x, y, index } = gridAtTime(syncStartMs, sr);
  if (index !== lastCellIndex) {
    lastCellIndex = index;
    highlightGrid(x, y);
    if (!cleared) playHeldAtGrid(x, y);
    else updateReadout(x, y);
  }
  requestAnimationFrame(loop);
}

function startLoop() {
  if (loopRunning) return;
  loopRunning = true;
  requestAnimationFrame(loop);
}

document.getElementById("clearBtn").onclick = () => {
  for (const code of held) setKeyVisual(code, false);
  held.clear();
  cleared = true;
  updateReadout();
};

window.addEventListener(
  "keydown",
  (e) => {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest("input, textarea, select")) return;
    if (e.key.length === 1) {
      e.preventDefault();
      void onKeyDown(e.key.charCodeAt(0));
    }
  },
  { capture: true }
);
window.addEventListener(
  "keyup",
  (e) => {
    if (e.target.closest("input, textarea, select")) return;
    if (e.key.length === 1) {
      e.preventDefault();
      onKeyUp(e.key.charCodeAt(0));
    }
  },
  { capture: true }
);

buildGrid();
buildKeys();
startLoop();
updateReadout();

if (syncParam) {
  const left = syncStartMs - Date.now();
  readout.textContent =
    left > 0
      ? `Sync in ${Math.ceil(left / 1000)}s · held ${held.size}`
      : `Synced · held ${held.size}`;
}

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
  u.searchParams.delete("host");
  return u.toString();
}

document.getElementById("hostStart").onclick = () => {
  const startMs = Date.now() + 5000;
  syncStartMs = startMs;
  lastCellIndex = -1;
  const url = buildMusicianUrl(startMs);
  document.getElementById("sharePanel").classList.remove("hidden");
  document.getElementById("musicianLink").textContent = url;
  renderQrCanvas(document.getElementById("shareQr"), url, { scale: 4, border: 2 });
  document.getElementById("copyBtn").classList.remove("hidden");
  setStatus("hostStatus", "Share link — grid starts in 5s", "ok");
  void ensureAudio();
};

document.getElementById("copyBtn").onclick = async () => {
  const text = document.getElementById("musicianLink").textContent;
  try {
    await navigator.clipboard.writeText(text);
    setStatus("hostStatus", "Link copied", "ok");
  } catch {
    setStatus("hostStatus", "Copy the link manually", "warn");
  }
};

if (params.has("host")) tabHost.click();
