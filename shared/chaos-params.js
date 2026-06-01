/**
 * Bounded chaotic maps for synthesis control.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function createLogisticMap(seed = 0.42, r = 3.92) {
  let x = clamp(seed, 0.001, 0.999);
  return {
    step() {
      x = r * x * (1 - x);
      return x;
    },
    value: () => x,
    nudge(delta) {
      x = clamp(x + delta, 0.001, 0.999);
    },
  };
}

export function createLorenzAttractor(seed = 0.1) {
  let x = 0.1 + seed * 0.2;
  let y = 0;
  let z = 0;
  const dt = 0.008;
  const sigma = 10;
  const rho = 28;
  const beta = 8 / 3;

  return {
    step() {
      const dx = sigma * (y - x);
      const dy = x * (rho - z) - y;
      const dz = x * y - beta * z;
      x += dx * dt;
      y += dy * dt;
      z += dz * dt;
      return { x, y, z };
    },
    nudge(dx = 0, dy = 0, dz = 0) {
      x += dx;
      y += dy;
      z += dz;
    },
    state() {
      return { x, y, z };
    },
  };
}

/** Map attractor state to 0..1 control voltages. */
export function chaosToControls(logistic, lorenz) {
  const lx = logistic.value();
  const { x, y, z } = lorenz.state();
  return {
    cutoff: 200 + lx * 4800,
    detune: clamp(x * 12, -24, 24),
    amp: clamp(0.15 + Math.abs(y) * 0.02, 0.08, 0.55),
    noise: clamp(Math.abs(z) * 0.015, 0, 0.2),
  };
}
