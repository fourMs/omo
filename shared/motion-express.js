/**
 * Map device motion (jerk + rotation) to smooth amplitude and vibrato depth.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function createMotionExpression({ baseAmp = 0.22 } = {}) {
  let last = { x: 0, y: 0, z: 0 };
  let primed = false;
  let smoothAmp = baseAmp;
  let smoothVib = 0;

  return {
  reset() {
    primed = false;
    last = { x: 0, y: 0, z: 0 };
    smoothAmp = baseAmp;
    smoothVib = 0;
  },

  /**
   * @param {{ x: number, y: number, z: number, rotAlpha?: number, rotBeta?: number, rotGamma?: number }} data
   * @returns {{ amp: number, vibCents: number, vibHz: number }}
   */
  update(data) {
    const { x, y, z, rotAlpha = 0, rotBeta = 0, rotGamma = 0 } = data;
    if (!primed) {
      last = { x, y, z };
      primed = true;
      return { amp: smoothAmp, vibCents: smoothVib, vibHz: 5 };
    }
    const jerk = Math.hypot(x - last.x, y - last.y, z - last.z);
    last = { x, y, z };
    const rotMag = Math.sqrt(rotAlpha ** 2 + rotBeta ** 2 + rotGamma ** 2);
    const ampTarget = clamp(0.14 + jerk / 2.4 + rotMag / 110, 0.1, 1);
    const vibTarget = clamp(jerk * 3.8 + rotMag * 0.12, 0, 16);
    smoothAmp = smoothAmp * 0.9 + ampTarget * 0.1;
    smoothVib = smoothVib * 0.86 + vibTarget * 0.14;
    return {
      amp: smoothAmp,
      vibCents: smoothVib,
      vibHz: 4.2 + smoothVib * 0.35,
    };
  },
  };
}
