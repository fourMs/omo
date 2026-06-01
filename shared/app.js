/**
 * Shared UI helpers — learn panel, status, iOS-safe audio unlock.
 */
import { getAudioContext, primeMicStream, unlockAudio } from "./audio.js";
import { renderQrCanvas } from "./qr.js";
import { injectLearnPedagogy } from "./learn-pedagogy.js";
import { loadA11yPreference } from "./workshop.js";

loadA11yPreference();

const AUDIO_TOGGLE_ID = "audioToggle";
const HEADER_CONTROLS_ID = "headerControls";
const QR_BTN_ID = "qrBtn";
const QR_PANEL_ID = "qrPanel";
let audioOn = false;
let qrBound = false;
let optionalBootFn = null;
let bootNeedsMic = false;

/** Group Learn + Audio on/off in the header (upper right). Safe to call more than once. */
export function initHeaderControls() {
  const header = document.querySelector(".app-header, .hub-header");
  if (!header) return;

  let wrap = document.getElementById(HEADER_CONTROLS_ID);
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.className = "header-controls";
    wrap.id = HEADER_CONTROLS_ID;
    header.appendChild(wrap);
  }

  const panel = document.getElementById("learnPanel");
  let learnBtn = document.getElementById("learnBtn");
  if (panel) {
    if (!learnBtn) {
      learnBtn = document.createElement("button");
      learnBtn.type = "button";
      learnBtn.id = "learnBtn";
      learnBtn.className = "learn-toggle";
      learnBtn.textContent = "Learn";
    } else if (learnBtn.parentElement && learnBtn.parentElement !== wrap) {
      learnBtn.remove();
    }
    if (!wrap.contains(learnBtn)) wrap.appendChild(learnBtn);
  }

  let qrBtn = document.getElementById(QR_BTN_ID);
  if (!qrBtn) {
    qrBtn = document.createElement("button");
    qrBtn.type = "button";
    qrBtn.id = QR_BTN_ID;
    qrBtn.className = "learn-toggle qr-toggle";
    qrBtn.textContent = "QR";
    qrBtn.setAttribute("aria-label", "Share QR code for this app");
    qrBtn.setAttribute("aria-haspopup", "dialog");
  } else if (qrBtn.parentElement && qrBtn.parentElement !== wrap) {
    qrBtn.remove();
  }
  const audioWrapExisting = wrap.querySelector(".audio-toggle-wrap");
  if (!wrap.contains(qrBtn)) {
    if (audioWrapExisting) wrap.insertBefore(qrBtn, audioWrapExisting);
    else wrap.appendChild(qrBtn);
  }

  if (!document.body.classList.contains("hub")) {
    if (!document.getElementById(AUDIO_TOGGLE_ID)) {
      const audioWrap = document.createElement("div");
      audioWrap.className = "audio-toggle-wrap";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.id = AUDIO_TOGGLE_ID;
      btn.className = "audio-toggle is-off";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", "Audio off");
      btn.innerHTML = '<span class="audio-toggle-label">Audio off</span>';
      btn.addEventListener("click", () => {
        void (audioOn ? setAudioOff() : setAudioOn());
      });
      audioWrap.appendChild(btn);
      wrap.appendChild(audioWrap);
      setAudioActive(false);
    }
  }
}

function ensureQrPanel() {
  let panel = document.getElementById(QR_PANEL_ID);
  if (panel) return panel;

  panel = document.createElement("div");
  panel.id = QR_PANEL_ID;
  panel.className = "qr-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-label", "Share QR code");
  panel.innerHTML = `
    <button type="button" class="qr-panel-backdrop" aria-label="Close"></button>
    <div class="qr-panel-sheet panel">
      <button type="button" class="qr-panel-close" aria-label="Close">×</button>
      <h2>Share instrument</h2>
      <p class="qr-caption">Scan to open this app on another phone</p>
      <div class="qr-share">
        <canvas id="qrCanvas" role="img" aria-label="QR code"></canvas>
      </div>
      <div class="link-box" id="qrLink"></div>
      <button type="button" class="btn btn-secondary btn-sm" id="qrCopyBtn">Copy link</button>
    </div>
  `;
  document.body.appendChild(panel);

  const close = () => closeQrPanel();
  panel.querySelector(".qr-panel-backdrop")?.addEventListener("click", close);
  panel.querySelector(".qr-panel-close")?.addEventListener("click", close);
  panel.querySelector("#qrCopyBtn")?.addEventListener("click", async () => {
    const text = document.getElementById("qrLink")?.textContent || location.href;
    try {
      await navigator.clipboard.writeText(text);
      setStatus(document.getElementById("qrCopyBtn"), "Copied!", "ok");
      setTimeout(() => {
        const b = document.getElementById("qrCopyBtn");
        if (b) b.textContent = "Copy link";
      }, 1400);
    } catch {
      setStatus(document.getElementById("qrCopyBtn"), "Copy manually", "warn");
    }
  });

  return panel;
}

function closeQrPanel() {
  const panel = document.getElementById(QR_PANEL_ID);
  const btn = document.getElementById(QR_BTN_ID);
  if (panel) panel.hidden = true;
  btn?.setAttribute("aria-expanded", "false");
}

export function openQrPanel(url = location.href) {
  const panel = ensureQrPanel();
  const linkEl = document.getElementById("qrLink");
  const canvas = document.getElementById("qrCanvas");
  if (linkEl) linkEl.textContent = url;
  if (canvas) renderQrCanvas(canvas, url, { scale: 4, border: 2 });
  document.getElementById("learnPanel")?.classList.remove("open");
  document.getElementById("learnBtn")?.setAttribute("aria-expanded", "false");
  panel.hidden = false;
  document.getElementById(QR_BTN_ID)?.setAttribute("aria-expanded", "true");
  panel.querySelector(".qr-panel-close")?.focus();
}

/** Header QR button — opens share dialog for the current page URL. */
export function bindQr(btnId = QR_BTN_ID) {
  initHeaderControls();
  if (qrBound) return;
  const btn = document.getElementById(btnId);
  if (!btn) return;
  qrBound = true;
  btn.addEventListener("click", () => {
    const panel = document.getElementById(QR_PANEL_ID);
    if (panel && !panel.hidden) closeQrPanel();
    else openQrPanel();
  });
}

export function bindLearn(learnBtnId = "learnBtn", panelId = "learnPanel") {
  initHeaderControls();
  bindQr();
  const btn = document.getElementById(learnBtnId);
  const panel = document.getElementById(panelId);
  btn?.addEventListener("click", () => {
    panel?.classList.toggle("open");
    const open = panel?.classList.contains("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) closeQrPanel();
  });
  btn?.setAttribute("aria-controls", panelId);
  injectLearnPedagogy(panelId);
}

/** Optional full setup (mic, graph) when user turns audio on from the header toggle. */
export function registerAudioBoot(fn, { mic = false } = {}) {
  optionalBootFn = fn;
  bootNeedsMic = mic;
}

/** @deprecated Use initHeaderControls */
export function initAudioToggle() {
  initHeaderControls();
}

/** @deprecated Use initHeaderControls */
export function ensureAudioBadge() {
  initHeaderControls();
}

export function isAudioActive() {
  return audioOn;
}

export function setAudioActive(on = true) {
  audioOn = !!on;
  const btn = document.getElementById(AUDIO_TOGGLE_ID);
  if (!btn) return;
  btn.classList.toggle("is-on", audioOn);
  btn.classList.toggle("is-off", !audioOn);
  btn.setAttribute("aria-pressed", String(audioOn));
  btn.setAttribute("aria-label", audioOn ? "Audio on" : "Audio off");
  const label = btn.querySelector(".audio-toggle-label");
  if (label) label.textContent = audioOn ? "Audio on" : "Audio off";
}

export async function setAudioOn() {
  if (bootNeedsMic) primeMicStream();
  return startAudio(optionalBootFn || undefined);
}

export async function setAudioOff() {
  const ctx = getAudioContext();
  try {
    if (ctx.state === "running") await ctx.suspend();
  } catch {
    /* ignore */
  }
  setAudioActive(false);
}

export function setStatus(id, text, kind = "") {
  const el = typeof id === "string" ? document.getElementById(id) : id;
  if (!el) return;
  el.textContent = text;
  el.classList.remove("ok", "warn");
  if (kind) el.classList.add(kind);
}

/** Short silent blip — call synchronously at the start of a touch handler. */
export function pingIOSUnlock(ctx) {
  const buf = ctx.createBuffer(1, 1, ctx.sampleRate);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.connect(ctx.destination);
  src.start();
  src.stop();
}

/**
 * Standard audio unlock (all instrument apps). Call from pointerdown / first play.
 * @param {(ctx: AudioContext) => void | Promise<void>} [initFn] One-shot setup (graph, mic, etc.)
 */
export async function startAudio(initFn) {
  const ctx = getAudioContext();
  pingIOSUnlock(ctx);
  await unlockAudio(ctx);
  if (initFn) await initFn(ctx);
  setAudioActive(true);
  return ctx;
}

/** Unlock audio on first tap anywhere (header, controls, stage, etc.). */
export function bindScreenAudioBoot(ensureReady, onReady, { mic = false } = {}) {
  document.body.addEventListener(
    "pointerdown",
    () => {
      if (mic) primeMicStream();
      void ensureReady().then(() => onReady?.());
    },
    { once: true, capture: true }
  );
}

/**
 * One-shot audio + app init on first user gesture (iOS-safe).
 * @param {object} [opts]
 * @param {boolean} [opts.screenTap=true] First tap anywhere on the page runs init (not only the play pad).
 */
export function createAudioBoot(initFn, { screenTap = true, mic = false } = {}) {
  let done = false;
  let pending = null;

  async function ensureReady() {
    if (done) return startAudio();
    if (!pending) {
      pending = startAudio(initFn)
        .then((ctx) => {
          done = true;
          return ctx;
        })
        .catch((err) => {
          pending = null;
          throw err;
        });
    }
    return pending;
  }

  if (screenTap) bindScreenAudioBoot(ensureReady, undefined, { mic });

  return ensureReady;
}

function autoInitHeaderControls() {
  if (document.querySelector(".app-header, .hub-header")) {
    initHeaderControls();
    bindQr();
  }
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoInitHeaderControls);
  } else {
    autoInitHeaderControls();
  }
}
