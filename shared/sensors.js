/**
 * Device motion/orientation with iOS 13+ permission flow.
 */

let motionHandler = null;
let orientationHandler = null;

export function needsMotionPermission() {
  return typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function";
}

// Single-flight permission requests: iOS shows one prompt per gesture, so
// concurrent callers join the same pending promise. A failed or denied
// attempt resets, so a later call can ask again.
//
// Gesture retry: WebKit only lets requestPermission() prompt during a user
// activation. touchend and click count as one on iOS; a touch-driven
// pointerdown or touchstart may not, and most apps start on pointerdown. When the request is refused for lack of a gesture
// (NotAllowedError), we wait for the next touchend or click (normally the
// end of the same tap) and ask again from there; callers keep awaiting the
// original promise, which then settles with the real Allow or Deny.
let motionPerm = null;
let orientationPerm = null;
const gestureRetries = [];

function onRetryGesture() {
  window.removeEventListener("touchend", onRetryGesture, true);
  window.removeEventListener("click", onRetryGesture, true);
  const queued = gestureRetries.splice(0);
  queued.forEach((fn) => fn());
}

function retryOnNextGesture(fn) {
  gestureRetries.push(fn);
  if (gestureRetries.length === 1) {
    window.addEventListener("touchend", onRetryGesture, { capture: true, passive: true });
    window.addEventListener("click", onRetryGesture, { capture: true, passive: true });
  }
}

/** @param {() => Promise<string>} ask the requestPermission call */
function askWithGestureRetry(ask) {
  return new Promise((resolve) => {
    const attempt = (isRetry) => {
      let p;
      try {
        p = Promise.resolve(ask());
      } catch (err) {
        p = Promise.reject(err);
      }
      p.then(
        (r) => resolve(r === "granted"),
        (err) => {
          if (!isRetry && err?.name === "NotAllowedError") retryOnNextGesture(() => attempt(true));
          else resolve(false);
        }
      );
    };
    attempt(false);
  });
}

export function requestMotionPermission() {
  if (!needsMotionPermission()) return Promise.resolve(true);
  // One iOS permission covers both APIs: join a request already under way.
  if (!motionPerm && orientationPerm) return orientationPerm;
  if (!motionPerm) {
    motionPerm = askWithGestureRetry(() => DeviceMotionEvent.requestPermission()).then((ok) => {
      if (!ok) motionPerm = null;
      return ok;
    });
  }
  return motionPerm;
}

export function requestOrientationPermission() {
  if (typeof DeviceOrientationEvent === "undefined" || typeof DeviceOrientationEvent.requestPermission !== "function") {
    return Promise.resolve(true);
  }
  if (!orientationPerm && motionPerm) return motionPerm;
  if (!orientationPerm) {
    orientationPerm = askWithGestureRetry(() => DeviceOrientationEvent.requestPermission()).then((ok) => {
      if (!ok) orientationPerm = null;
      return ok;
    });
  }
  return orientationPerm;
}

/**
 * On iOS one "Motion and Orientation" permission covers both APIs, so when
 * motion is needed only the motion request is made: a second, orientation
 * request after an await would run outside the tap gesture and could be
 * refused. Elsewhere there is nothing to ask for and both resolve true.
 * @param {{ needMotion?: boolean, needOrientation?: boolean }} [opts]
 */
export async function enableSensors({ needMotion = true, needOrientation = true } = {}) {
  if (needMotion && needsMotionPermission()) return requestMotionPermission();
  return needOrientation ? requestOrientationPermission() : true;
}

let sensorPrime = null;

/**
 * Start permission requests on the same user gesture (before any await).
 * A false result is not cached, so a later tap can try again.
 */
export function primeSensors(opts) {
  if (!sensorPrime) {
    sensorPrime = enableSensors(opts)
      .catch(() => false)
      .then((ok) => {
        if (!ok) sensorPrime = null;
        return ok;
      });
  }
  return sensorPrime;
}

/**
 * @param {(data: { x: number, y: number, z: number, alpha?: number, beta?: number, gamma?: number }) => void} callback
 */
export function onMotion(callback) {
  motionHandler = (e) => {
    const grav = e.accelerationIncludingGravity;
    const lin = e.acceleration;
    const a = lin || grav;
    const r = e.rotationRate;
    callback({
      x: a?.x ?? 0,
      y: a?.y ?? 0,
      z: a?.z ?? 0,
      linear: lin
        ? { x: lin.x ?? 0, y: lin.y ?? 0, z: lin.z ?? 0 }
        : null,
      rotAlpha: r?.alpha ?? 0,
      rotBeta: r?.beta ?? 0,
      rotGamma: r?.gamma ?? 0,
    });
  };
  window.addEventListener("devicemotion", motionHandler, { passive: true });
}

export function onOrientation(callback) {
  if (orientationHandler) {
    window.removeEventListener("deviceorientation", orientationHandler);
    window.removeEventListener("deviceorientationabsolute", orientationHandler);
  }
  orientationHandler = (e) => {
    const safe = (v, fallback = 0) =>
      typeof v === "number" && Number.isFinite(v) ? v : fallback;
    let alpha = e.alpha;
    if ((alpha == null || Number.isNaN(alpha)) && typeof e.webkitCompassHeading === "number") {
      alpha = e.webkitCompassHeading;
    }
    callback({
      alpha: safe(alpha, 0),
      beta: safe(e.beta, 0),
      gamma: safe(e.gamma, 0),
      webkitCompassHeading:
        typeof e.webkitCompassHeading === "number" ? e.webkitCompassHeading : null,
      absolute: !!e.absolute,
    });
  };
  window.addEventListener("deviceorientation", orientationHandler, { passive: true });
  window.addEventListener("deviceorientationabsolute", orientationHandler, { passive: true });
}

export function stopSensors() {
  if (motionHandler) window.removeEventListener("devicemotion", motionHandler);
  if (orientationHandler) {
    window.removeEventListener("deviceorientation", orientationHandler);
    window.removeEventListener("deviceorientationabsolute", orientationHandler);
  }
  motionHandler = null;
  orientationHandler = null;
  sensorPrime = null;
}

/** Normalize accel to roughly -1..1 for portrait hold */
export function normalizeAccel(x, y, z) {
  const mag = Math.sqrt(x * x + y * y + z * z) || 1;
  return { x: x / mag, y: y / mag, z: z / mag, mag };
}

function angleDiffDeg(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
  let d = a - b;
  while (d > 180) d -= 360;
  while (d < -180) d += 360;
  return d;
}

/**
 * devicemotion rotationRate is often missing on Android — fall back to orientation spin rates.
 * @param {(data: {
 *   x: number, y: number, z: number,
 *   rotAlpha: number, rotBeta: number, rotGamma: number,
 *   gyroSource: 'sensor' | 'tilt' | 'none'
 * }) => void} callback
 * @param {{ needOrientation?: boolean }} [opts]
 */
export function onMotionGyro(callback, { needOrientation = true } = {}) {
  let oriRates = { alpha: 0, beta: 0, gamma: 0 };
  let prevOri = null;
  let prevOriT = 0;

  if (needOrientation) {
    onOrientation((o) => {
      const t = performance.now();
      if (prevOri != null && prevOriT > 0) {
        const dt = Math.max(0.008, (t - prevOriT) / 1000);
        oriRates = {
          alpha: angleDiffDeg(o.alpha, prevOri.alpha) / dt,
          beta: angleDiffDeg(o.beta, prevOri.beta) / dt,
          gamma: angleDiffDeg(o.gamma, prevOri.gamma) / dt,
        };
      }
      prevOri = { alpha: o.alpha, beta: o.beta, gamma: o.gamma };
      prevOriT = t;
    });
  }

  onMotion((data) => {
    let rotAlpha = data.rotAlpha ?? 0;
    let rotBeta = data.rotBeta ?? 0;
    let rotGamma = data.rotGamma ?? 0;
    let gyroSource = "sensor";
    if (Math.hypot(rotAlpha, rotBeta, rotGamma) < 0.5) {
      rotAlpha = oriRates.alpha;
      rotBeta = oriRates.beta;
      rotGamma = oriRates.gamma;
      gyroSource = Math.hypot(rotAlpha, rotBeta, rotGamma) > 0.5 ? "tilt" : "none";
    }
    callback({
      ...data,
      rotAlpha,
      rotBeta,
      rotGamma,
      gyroSource,
    });
  });
}
