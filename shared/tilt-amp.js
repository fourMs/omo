/**
 * Map device orientation beta (front–back tilt, degrees) to amplitude.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** @returns {number} 0 (quiet) … 1 (loud) */
export function ampFromTiltBeta(beta, { betaMin = 28, betaMax = 152 } = {}) {
  const b = typeof beta === "number" && Number.isFinite(beta) ? beta : 90;
  return clamp((b - betaMin) / (betaMax - betaMin), 0, 1);
}

/**
 * Primary level from tilt; motion shake adds a small boost and still drives vibrato elsewhere.
 * @param {number} beta
 * @param {number} motionAmp 0–1 from createMotionExpression
 */
export function playAmpFromTiltAndMotion(beta, motionAmp, { floor = 0.1, tiltGain = 0.68, motionGain = 0.2 } = {}) {
  const tiltT = ampFromTiltBeta(beta);
  const motion = typeof motionAmp === "number" ? motionAmp : 0.22;
  return clamp(floor + tiltT * tiltGain + motion * motionGain, 0.1, 1);
}
