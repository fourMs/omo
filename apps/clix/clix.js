import { bindLearn, setStatus, startAudio } from "../../shared/app.js";
import { renderQrCanvas } from "../../shared/qr.js";
import {
  CLIX_GAINS,
  GRID_H,
  GRID_W,
  cellDurationSec,
  createClixReverb,
  gainAt,
  gridAt,
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
const syncStartParam = params.get("sync");
let syncStartMs = syncStartParam ? parseInt(syncStartParam, 10) : 0;

let ctx = null;
let master = null;
let channelWhich = 0;
const queue = [];
let lastCellIndex = -1;
let raf = 0;
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
      btn.dataset.code = String(ch.charCodeAt(0));
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        enqueueKey(ch.charCodeAt(0));
      });
      keysEl.appendChild(btn);
    }
  }
}

function ensureAudio(cb) {
  void startAudio((c) => {
    if (!ctx) {
      ctx = c;
      master = createClixReverb(ctx, ctx.destination);
      if (!syncStartMs) syncStartMs = Date.now() + 400;
      loop();
    }
    cb?.();
  });
}

function enqueueKey(code) {
  if (code < 32 || code > 126) return;
  if (cleared) cleared = false;
  ensureAudio();
  queue.push(code);
  updateReadout();
}

function updateReadout(x, y) {
  const gx = x ?? "—";
  const gy = y ?? "—";
  const g = x != null && y != null ? gainAt(x, y).toFixed(2) : "—";
  readout.textContent = `grid ${gx},${gy} · vel ${g} · queue ${queue.length}`;
}

function highlightGrid(x, y) {
  gridEl.querySelectorAll(".clix-cell").forEach((c) => c.classList.remove("on"));
  const on = gridEl.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  if (on) on.classList.add("on");
}

function drainOne(x, y) {
  if (!queue.length || !ctx || !master) return;
  const code = queue.shift();
  const vel = gainAt(x, y);
  playClixNote(ctx, master, code, vel, channelWhich);
  channelWhich = (channelWhich + 1) % 2;
  updateReadout(x, y);
}

function loop() {
  if (!ctx) return;
  const { x, y, index } = gridAt(syncStartMs, ctx);
  if (index !== lastCellIndex) {
    lastCellIndex = index;
    highlightGrid(x, y);
    if (!cleared) drainOne(x, y);
    else updateReadout(x, y);
  }
  raf = requestAnimationFrame(loop);
}

document.getElementById("clearBtn").onclick = () => {
  queue.length = 0;
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
      enqueueKey(e.key.charCodeAt(0));
    }
  },
  { capture: true }
);

buildGrid();
buildKeys();
updateReadout();

if (syncStartParam) {
  const left = syncStartMs - Date.now();
  readout.textContent =
    left > 0 ? `Sync in ${Math.ceil(left / 1000)}s · queue ${queue.length}` : `Synced · queue ${queue.length}`;
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
  ensureAudio();
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

document.body.addEventListener(
  "pointerdown",
  () => ensureAudio(),
  { once: true, capture: true }
);

if (params.has("host")) tabHost.click();
