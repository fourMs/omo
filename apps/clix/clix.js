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
  { chars: "1234567890", rowClass: "clix-row-numpad" },
  { chars: "qwertyuiop", rowClass: "" },
  { chars: "asdfghjkl", rowClass: "" },
  { chars: "zxcvbnm", rowClass: "" },
];

const params = new URLSearchParams(location.search);
const syncParam = params.get("sync");
let syncStartMs = syncParam ? parseInt(syncParam, 10) : Date.now();
if (!Number.isFinite(syncStartMs)) syncStartMs = Date.now();

let ctx = null;
let master = null;
let channelWhich = 0;
const held = new Set();
/** @type {Map<number, HTMLElement>} */
const keyBtns = new Map();
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

function isPlayableCode(code) {
  return code >= 32 && code <= 126;
}

function codeFromKeyEvent(e) {
  if (e.key?.length === 1) return e.key.charCodeAt(0);
  const m = /^Numpad([0-9])$/.exec(e.code || "");
  if (m) return m[1].charCodeAt(0);
  const d = /^Digit([0-9])$/.exec(e.code || "");
  if (d) return d[1].charCodeAt(0);
  return -1;
}

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

function bindKeyButton(btn, code) {
  keyBtns.set(code, btn);
  btn.dataset.ch = String.fromCharCode(code);
  btn.setAttribute("aria-pressed", "false");

  btn.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    try {
      btn.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    void onKeyDown(code);
  });

  const release = (e) => {
    if (e.pointerId != null && btn.hasPointerCapture?.(e.pointerId)) {
      try {
        btn.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    onKeyUp(code);
  };
  btn.addEventListener("pointerup", release);
  btn.addEventListener("pointercancel", release);
  btn.addEventListener("lostpointercapture", () => onKeyUp(code));
}

function buildKeys() {
  keysEl.innerHTML = "";
  keyBtns.clear();
  for (const { chars, rowClass } of KEY_ROWS) {
    const row = document.createElement("div");
    row.className = `clix-row${rowClass ? ` ${rowClass}` : ""}`;
    for (const ch of chars) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "clix-key";
      btn.textContent = ch;
      bindKeyButton(btn, ch.charCodeAt(0));
      row.appendChild(btn);
    }
    keysEl.appendChild(row);
  }
}

function buildAudio(c) {
  ctx = c;
  const bus = createMasterBus(c, 0.75);
  master = createClixReverb(c, bus.master);
  catchUpHeldNotes();
}

registerAudioBoot(buildAudio);

async function ensureAudio() {
  if (ctx && master) return ctx;
  return startAudio(buildAudio);
}

function setKeyHeld(code, down) {
  const btn = keyBtns.get(code);
  if (!btn) return;
  btn.classList.toggle("down", down);
  btn.setAttribute("aria-pressed", down ? "true" : "false");
}

function playNoteNow(code) {
  if (!ctx || !master) return;
  const { x, y } = gridAtTime(syncStartMs, ctx.sampleRate);
  playClixNote(ctx, master, code, gainAt(x, y), channelWhich);
  channelWhich = (channelWhich + 1) % 2;
}

function playHeldAtGrid(x, y) {
  if (!held.size || !ctx || !master || cleared) return;
  const vel = gainAt(x, y);
  for (const code of held) {
    playClixNote(ctx, master, code, vel, channelWhich);
    channelWhich = (channelWhich + 1) % 2;
  }
  updateReadout(x, y);
}

function catchUpHeldNotes() {
  if (!held.size || !ctx || !master) return;
  const { x, y, index } = gridAtTime(syncStartMs, ctx.sampleRate);
  lastCellIndex = index;
  highlightGrid(x, y);
  playHeldAtGrid(x, y);
}

async function onKeyDown(code) {
  if (!isPlayableCode(code)) return;
  const wasHeld = held.has(code);
  if (cleared) cleared = false;
  await ensureAudio();
  held.add(code);
  setKeyHeld(code, true);
  if (!wasHeld) playNoteNow(code);
  updateReadout();
}

function onKeyUp(code) {
  if (!isPlayableCode(code)) return;
  if (!held.delete(code)) return;
  setKeyHeld(code, false);
  updateReadout();
}

function releaseAllKeys() {
  for (const code of [...held]) onKeyUp(code);
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
  gridEl.querySelector(`[data-x="${x}"][data-y="${y}"]`)?.classList.add("on");
}

function onGridStep(x, y, index) {
  highlightGrid(x, y);
  if (cleared || !held.size) {
    updateReadout(x, y);
    return;
  }
  void ensureAudio().then(() => {
    if (ctx && master) playHeldAtGrid(x, y);
  });
}

function loop() {
  if (!loopRunning) return;
  const sr = ctx?.sampleRate ?? 48000;
  const { x, y, index } = gridAtTime(syncStartMs, sr);
  if (index !== lastCellIndex) {
    lastCellIndex = index;
    onGridStep(x, y, index);
  }
  requestAnimationFrame(loop);
}

function startLoop() {
  if (loopRunning) return;
  loopRunning = true;
  requestAnimationFrame(loop);
}

document.getElementById("clearBtn").onclick = () => {
  releaseAllKeys();
  cleared = true;
  updateReadout();
};

window.addEventListener(
  "keydown",
  (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest("input, textarea, select")) return;
    const code = codeFromKeyEvent(e);
    if (code < 0 || !isPlayableCode(code)) return;
    if (e.repeat && held.has(code)) return;
    e.preventDefault();
    void onKeyDown(code);
  },
  { capture: true }
);
window.addEventListener(
  "keyup",
  (e) => {
    if (e.target.closest("input, textarea, select")) return;
    const code = codeFromKeyEvent(e);
    if (code < 0 || !isPlayableCode(code)) return;
    e.preventDefault();
    onKeyUp(code);
  },
  { capture: true }
);

window.addEventListener("blur", releaseAllKeys);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") releaseAllKeys();
});

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
