/**
 * Lightweight hand tracking in the upper “bow” band of a front-camera frame.
 * Combines frame differencing, background subtraction, and skin-tone cues — no ML deps.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function isSkinPixel(r, g, b) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  if (y < 35 || y > 245) return false;
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  if (cb >= 73 && cb <= 133 && cr >= 127 && cr <= 178) return true;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return r > 55 && g > 30 && b > 12 && r > g && max - min > 10 && max < 252;
}

/** @returns {{ prevGray: Float32Array, bgGray: Float32Array, primed: boolean }} */
export function createHandBowState(w, h, bowZone = 0.55) {
  const n = w * Math.max(1, Math.floor(h * bowZone));
  return { prevGray: new Float32Array(n), bgGray: new Float32Array(n), primed: false };
}

function grayAt(data, pi) {
  const i = pi * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 765;
}

/**
 * @param {ImageData} img
 * @param {number} w
 * @param {number} h
 * @param {{ prevGray: Float32Array, bgGray: Float32Array, primed: boolean }} state
 * @param {number} bowZone — fraction of frame height (top band)
 */
export function trackHandInBowZone(img, w, h, state, bowZone = 0.55) {
  const data = img.data;
  const yMax = Math.max(1, Math.floor(h * bowZone));
  const area = w * yMax;
  const { prevGray, bgGray } = state;

  if (!state.primed) {
    for (let y = 0; y < yMax; y++) {
      for (let x = 0; x < w; x++) {
        const pi = y * w + x;
        const gray = grayAt(data, pi);
        prevGray[pi] = gray;
        bgGray[pi] = gray;
      }
    }
    state.primed = true;
    return { present: false, cx: 0, cy: 0, mass: 0, nx: 0.5, ny: 0.25 };
  }

  let sumX = 0;
  let sumY = 0;
  let weight = 0;
  let count = 0;

  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < w; x++) {
      const pi = y * w + x;
      const i = pi * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const gray = (r + g + b) / 765;
      const diff = Math.abs(gray - prevGray[pi]);
      const bgDiff = Math.abs(gray - bgGray[pi]);
      const skin = isSkinPixel(r, g, b);
      const moving = diff > 0.018;
      const blob = bgDiff > 0.045;
      const skinFg = skin && (diff > 0.006 || bgDiff > 0.028);
      const fg = moving || blob || skinFg;

      prevGray[pi] = gray;
      if (!fg) bgGray[pi] = bgGray[pi] * 0.94 + gray * 0.06;

      if (fg) {
        const wgt = 1 + diff * 8 + bgDiff * 4 + (skin ? 0.65 : 0);
        sumX += x * wgt;
        sumY += y * wgt;
        weight += wgt;
        count++;
      }
    }
  }

  const mass = count / area;
  if (mass < 0.0035 || weight <= 0) {
    return { present: false, cx: 0, cy: 0, mass: 0, nx: 0.5, ny: 0.25 };
  }

  const cx = sumX / weight;
  const cy = sumY / weight;
  return {
    present: true,
    cx,
    cy,
    mass,
    nx: cx / Math.max(1, w - 1),
    ny: cy / Math.max(1, yMax - 1),
  };
}

/**
 * Bow drive from horizontal hand speed (camera coords, 0..w).
 */
export function bowFromHandSpeed(lastCx, cx, w, gain = 13) {
  if (lastCx == null) return 0;
  const dx = Math.abs(cx - lastCx) / Math.max(1, w);
  return clamp(dx * gain, 0, 1);
}

/** Bow drive from overall motion in the bow zone (works without hand lock). */
export function bowFromZoneMotion(img, w, h, state, bowZone = 0.55) {
  if (!state?.primed) return 0;
  const data = img.data;
  const yMax = Math.max(1, Math.floor(h * bowZone));
  const { prevGray } = state;
  let sum = 0;
  const n = w * yMax;
  for (let y = 0; y < yMax; y++) {
    for (let x = 0; x < w; x++) {
      const pi = y * w + x;
      sum += Math.abs(grayAt(data, pi) - prevGray[pi]);
    }
  }
  return clamp((sum / n) * 42, 0, 1);
}
