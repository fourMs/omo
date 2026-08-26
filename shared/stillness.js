/**
 * Stillness / micromotion tracking for inverse sonification apps.
 *
 * Sonification principles follow the Oslo Standstill Database front end
 * (Jensenius/Laczkó): log-scaled quantity of motion, brightness rather than
 * pitch for motion amount, adaptive baselines with a noise floor, and an
 * asymmetric gate — motion silences fast, stillness must be earned back slowly.
 *
 * Bands (per the standstill research): postural sway lives below ~1 Hz,
 * tremor and heartbeat around 2–8 Hz. A phone accelerometer cannot measure
 * position, so all quantities here are unitless activity scores normalised
 * against a per-device calibrated noise floor.
 */
import { onMotion, onOrientation } from "./sensors.js";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const clamp01 = (v) => clamp(v, 0, 1);

/** Log-scaled normalisation: equal ratios of motion give equal steps (0..1). */
export function logNorm(value, lo, hi) {
  const l = Math.log(lo);
  return clamp01((Math.log(Math.max(value, 1e-9)) - l) / (Math.log(hi) - l));
}

/** Per-sample EMA coefficient for a time constant in seconds at rate dt. */
function alphaFor(tauSec, dtSec) {
  return 1 - Math.exp(-dtSec / Math.max(tauSec, 1e-3));
}

function angleDiffDeg(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  let d = a - b;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

/**
 * Motion tracker with calibration, band split, and an inverse stillness gate.
 *
 * Call start() after enableSensors() resolves, then read state each frame:
 *   stillness   0..1 smoothed inverse gate (1 = holding still)
 *   stillSeconds seconds of sustained stillness (resets on movement)
 *   tremor      0..1 log-scaled fast-band activity (jerk, ~2 Hz and up)
 *   sway        0..1 log-scaled slow-band tilt drift (below ~1 Hz)
 *   rotation    0..1 log-scaled rotation-rate magnitude
 *   swayX/swayY -1..1 sway direction, normalised by its own running spread
 *   gyroSource  'sensor' | 'tilt' | 'none'
 *
 * @param {object} [opts]
 * @param {number} [opts.stillAfter=0.7]   stillness above this accrues stillSeconds
 * @param {number} [opts.breakBelow=0.35]  stillness below this resets stillSeconds
 */
export function createStillness({ stillAfter = 0.7, breakBelow = 0.35 } = {}) {
  // Reference activity for "clearly moving" — the gate closes fully here.
  // Jerk reference matches the proven constant in video-sonifier (0.28 m/s²
  // per sample at ~60 Hz); sway/rotation are scaled to contribute similarly.
  const JERK_REF = 0.28;
  const SWAY_REF = 2.4; // deg of banded tilt drift
  const ROT_REF = 40; // deg/s

  // Log-scale spans for the band readouts (floor-relative, see calibration).
  const TREMOR_SPAN = [0.004, 0.4];
  const SWAY_SPAN = [0.05, 6];
  const ROT_SPAN = [0.3, 60];

  const state = {
    running: false,
    /** True once a devicemotion event has arrived — false means no accelerometer. */
    hasMotion: false,
    calibrating: false,
    calibrated: false,
    calibrationProgress: 0,
    stillness: 0,
    stillSeconds: 0,
    tremor: 0,
    sway: 0,
    rotation: 0,
    swayX: 0,
    swayY: 0,
    gyroSource: "none",
    /** Raw combined activity relative to the movement reference (0..~n). */
    activity: 1,
  };

  // Sensor accumulators.
  let lastAccel = null;
  let jerkEma = 0; // fast band (tremor)
  let emaShortB = null, emaShortG = null; // tilt, τ≈0.25 s
  let emaLongB = null, emaLongG = null; // tilt, τ≈2.5 s
  let rotEma = 0;
  let swaySpread = 0.4; // running |swayG| envelope, floored (deg)
  let prevOri = null;
  let prevOriT = 0;
  let oriRateMag = 0;
  let lastMotionT = 0;
  let sawRealGyro = false;

  // Calibrated noise floors (per band). Defaults suit a phone held in hand.
  let floorJerk = 0.012;
  let floorSway = 0.12;
  let floorRot = 1.2;
  let calSamples = null;
  let calEndT = 0;
  let calDone = null;

  function handleMotion(m) {
    state.hasMotion = true;
    const now = performance.now();
    const dt = lastMotionT ? clamp((now - lastMotionT) / 1000, 0.004, 0.1) : 1 / 60;
    lastMotionT = now;

    // Fast band: per-sample jerk, lightly smoothed (τ≈80 ms keeps tremor).
    if (lastAccel) {
      const jerk = Math.hypot(m.x - lastAccel.x, m.y - lastAccel.y, m.z - lastAccel.z);
      jerkEma += alphaFor(0.08, dt) * (jerk - jerkEma);
    }
    lastAccel = { x: m.x, y: m.y, z: m.z };

    // Rotation rate: real gyro when present, orientation-delta fallback otherwise.
    const rawRot = Math.hypot(m.rotAlpha || 0, m.rotBeta || 0, m.rotGamma || 0);
    if (rawRot > 0.5) sawRealGyro = true;
    const rot = sawRealGyro ? rawRot : oriRateMag;
    rotEma += alphaFor(0.15, dt) * (rot - rotEma);
    state.gyroSource = sawRealGyro ? "sensor" : oriRateMag > 0 || prevOri ? "tilt" : "none";

    update(dt);
  }

  function handleOrientation(o) {
    const now = performance.now();
    const dt = prevOriT ? clamp((now - prevOriT) / 1000, 0.004, 0.2) : 1 / 60;

    // Slow band: banded tilt drift = short EMA minus long EMA of the angles.
    if (emaShortB == null) {
      emaShortB = emaLongB = o.beta;
      emaShortG = emaLongG = o.gamma;
    } else {
      emaShortB += alphaFor(0.25, dt) * angleDiffDeg(o.beta, emaShortB);
      emaShortG += alphaFor(0.25, dt) * angleDiffDeg(o.gamma, emaShortG);
      emaLongB += alphaFor(2.5, dt) * angleDiffDeg(o.beta, emaLongB);
      emaLongG += alphaFor(2.5, dt) * angleDiffDeg(o.gamma, emaLongG);
    }

    // Rotation fallback for gyro-less phones (orientation deltas, deg/s).
    if (prevOri && prevOriT) {
      const mag = Math.hypot(
        angleDiffDeg(o.alpha, prevOri.alpha) / dt,
        angleDiffDeg(o.beta, prevOri.beta) / dt,
        angleDiffDeg(o.gamma, prevOri.gamma) / dt
      );
      oriRateMag += alphaFor(0.15, dt) * (mag - oriRateMag);
    }
    prevOri = { alpha: o.alpha, beta: o.beta, gamma: o.gamma };
    prevOriT = now;
  }

  function swayNow() {
    if (emaShortB == null) return { mag: 0, x: 0, y: 0 };
    const dB = angleDiffDeg(emaShortB, emaLongB);
    const dG = angleDiffDeg(emaShortG, emaLongG);
    return { mag: Math.hypot(dB, dG), x: dG, y: dB };
  }

  function update(dt) {
    const sway = swayNow();

    if (state.calibrating) {
      calSamples.jerk.push(jerkEma);
      calSamples.sway.push(sway.mag);
      calSamples.rot.push(rotEma);
      state.calibrationProgress = clamp01(
        1 - (calEndT - performance.now()) / calSamples.durMs
      );
      if (performance.now() >= calEndT) finishCalibration();
      return;
    }

    // Floor-relative activity per band, each normalised so 1 = clearly moving.
    const tremorAct = Math.max(0, jerkEma - floorJerk) / JERK_REF;
    const swayAct = Math.max(0, sway.mag - floorSway) / SWAY_REF;
    const rotAct = Math.max(0, rotEma - floorRot) / ROT_REF;
    state.activity = tremorAct + swayAct * 0.7 + rotAct * 0.8;

    // Asymmetric gate: movement closes fast (τ 0.12 s), stillness returns
    // slowly (τ 1.4 s) — you can break the sound instantly but must earn it back.
    const target = clamp01(1 - state.activity);
    const tau = target < state.stillness ? 0.12 : 1.4;
    state.stillness += alphaFor(tau, dt) * (target - state.stillness);

    if (state.stillness >= stillAfter) state.stillSeconds += dt;
    else if (state.stillness < breakBelow) state.stillSeconds = 0;

    // Band readouts, log-scaled above the calibrated floor.
    state.tremor = logNorm(Math.max(0, jerkEma - floorJerk), TREMOR_SPAN[0], TREMOR_SPAN[1]);
    state.sway = logNorm(Math.max(0, sway.mag - floorSway * 0.5), SWAY_SPAN[0], SWAY_SPAN[1]);
    state.rotation = logNorm(Math.max(0, rotEma - floorRot * 0.5), ROT_SPAN[0], ROT_SPAN[1]);

    // Sideways sway against its own running spread (standstill-style EMA with
    // a floor so a genuinely still body never slams to full pan).
    swaySpread += alphaFor(4, dt) * (Math.hypot(sway.x, sway.y) - swaySpread);
    const spread = Math.max(swaySpread, 0.4);
    state.swayX = clamp(sway.x / spread, -1, 1);
    state.swayY = clamp(sway.y / spread, -1, 1);
  }

  function finishCalibration() {
    const q = (arr, p) => {
      if (!arr.length) return 0;
      const s = [...arr].sort((a, b) => a - b);
      return s[Math.min(s.length - 1, Math.floor(p * s.length))];
    };
    // Floor = 75th percentile of "holding still" — above sensor noise, below
    // real movement. Keep defaults as minimums for very quiet sensors.
    floorJerk = Math.max(0.006, q(calSamples.jerk, 0.75) * 1.4);
    floorSway = Math.max(0.06, q(calSamples.sway, 0.75) * 1.4);
    floorRot = Math.max(0.6, q(calSamples.rot, 0.75) * 1.4);
    calSamples = null;
    state.calibrating = false;
    state.calibrated = true;
    state.calibrationProgress = 1;
    state.stillness = 1;
    state.stillSeconds = 0;
    calDone?.();
    calDone = null;
  }

  return {
    state,

    /** Subscribe to sensors. Call once, after enableSensors() resolves. */
    start() {
      if (state.running) return;
      state.running = true;
      onMotion(handleMotion);
      onOrientation(handleOrientation);
    },

    /**
     * Learn this device's noise floor while the player holds still.
     * @param {number} [seconds=2]
     * @returns {Promise<void>} resolves when calibration completes
     */
    calibrate(seconds = 2) {
      calSamples = { jerk: [], sway: [], rot: [], durMs: seconds * 1000 };
      calEndT = performance.now() + seconds * 1000;
      state.calibrating = true;
      state.calibrated = false;
      state.calibrationProgress = 0;
      return new Promise((resolve) => {
        calDone = resolve;
        // Completion is driven by devicemotion events; without an
        // accelerometer (desktop) none arrive — finish on a timer so the
        // promise always resolves and hasMotion tells the app what happened.
        setTimeout(() => {
          if (state.calibrating) finishCalibration();
        }, seconds * 1000 + 1200);
      });
    },
  };
}
