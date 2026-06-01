/**
 * Circular drum sequencer — draw + hit-test for concentric step rings.
 */

const TAU = Math.PI * 2;
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export const CIRC_SEQ_RING_COLORS = [
  { on: "#b91c1c", off: "#3f1515", dim: "#5c1a1a" },
  { on: "#ea580c", off: "#3d1a0a", dim: "#6b2a10" },
  { on: "#ca8a04", off: "#3d3208", dim: "#6b5610" },
  { on: "#16a34a", off: "#0f2918", dim: "#1a4d2a" },
];

export function circSeqLayout(w, h, rings, steps) {
  const cx = w / 2;
  const cy = h / 2;
  const outer = Math.min(w, h) * 0.46;
  const innerPad = outer * 0.14;
  const ringWidth = (outer - innerPad) / rings;
  const stepGap = 0.028;
  return { cx, cy, outer, innerPad, ringWidth, stepGap, rings, steps };
}

/**
 * @param {CanvasRenderingContext2D} g
 * @param {number} w
 * @param {number} h
 * @param {number} dpr
 * @param {{ pattern: boolean[][], rows: { icon: string, name: string }[], playStep?: number, selectedRing?: number }} opts
 */
export function drawCircularSeq(g, w, h, dpr, opts) {
  const { pattern, rows, playStep = -1, selectedRing = -1 } = opts;
  const rings = rows.length;
  const steps = pattern[0]?.length ?? 16;
  const L = circSeqLayout(w, h, rings, steps);
  const { cx, cy, outer, innerPad, ringWidth, stepGap } = L;

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#0f172a";
  g.fillRect(0, 0, w, h);

  for (let si = 0; si < steps; si++) {
    const a0 = -Math.PI / 2 + (si / steps) * TAU + stepGap;
    const a1 = -Math.PI / 2 + ((si + 1) / steps) * TAU - stepGap;
    const playing = si === playStep;
    for (let ri = 0; ri < rings; ri++) {
      const rOut = outer - ri * ringWidth;
      const rIn = rOut - ringWidth + 1 * dpr;
      const on = !!pattern[ri]?.[si];
      const pal = CIRC_SEQ_RING_COLORS[ri] ?? CIRC_SEQ_RING_COLORS[0];
      g.beginPath();
      g.arc(cx, cy, rOut, a0, a1);
      g.arc(cx, cy, rIn, a1, a0, true);
      g.closePath();
      if (playing) {
        g.fillStyle = on ? "#6ee7b7" : "rgba(110, 231, 183, 0.12)";
      } else {
        g.fillStyle = on ? pal.on : pal.off;
      }
      g.fill();
      if (on && !playing) {
        g.strokeStyle = pal.dim;
        g.lineWidth = 1 * dpr;
        g.stroke();
      }
    }
  }

  g.strokeStyle = "#475569";
  g.lineWidth = 1.5 * dpr;
  for (let ri = 0; ri <= rings; ri++) {
    const r = outer - ri * ringWidth;
    g.beginPath();
    g.arc(cx, cy, r, 0, TAU);
    g.stroke();
  }

  for (let si = 0; si < steps; si++) {
    const a = -Math.PI / 2 + (si / steps) * TAU;
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * innerPad, cy + Math.sin(a) * innerPad);
    g.lineTo(cx + Math.cos(a) * outer, cy + Math.sin(a) * outer);
    g.strokeStyle = si % 4 === 0 ? "#64748b" : "#334155";
    g.lineWidth = (si % 4 === 0 ? 1.5 : 0.75) * dpr;
    g.stroke();
  }

  if (playStep >= 0) {
    const a = -Math.PI / 2 + ((playStep + 0.5) / steps) * TAU;
    g.strokeStyle = "#6ee7b7";
    g.lineWidth = 3 * dpr;
    g.lineCap = "round";
    g.beginPath();
    g.moveTo(cx, cy);
    g.lineTo(cx + Math.cos(a) * outer * 1.02, cy + Math.sin(a) * outer * 1.02);
    g.stroke();
  }

  g.fillStyle = "#1e293b";
  g.strokeStyle = "#6ee7b7";
  g.lineWidth = 2 * dpr;
  g.beginPath();
  g.arc(cx, cy, innerPad * 0.92, 0, TAU);
  g.fill();
  g.stroke();

  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `600 ${11 * dpr}px system-ui,sans-serif`;
  g.fillStyle = "#94a3b8";
  g.fillText(`${steps}`, cx, cy - 5 * dpr);
  g.font = `500 ${8 * dpr}px system-ui,sans-serif`;
  g.fillText("steps", cx, cy + 7 * dpr);

  g.textAlign = "left";
  g.textBaseline = "top";
  g.font = `${10 * dpr}px system-ui,sans-serif`;
  g.fillStyle = "#94a3b8";
  let ly = 8 * dpr;
  for (let ri = 0; ri < rings; ri++) {
    const pal = CIRC_SEQ_RING_COLORS[ri];
    g.fillStyle = pal.on;
    g.fillRect(8 * dpr, ly, 8 * dpr, 8 * dpr);
    g.fillStyle = ri === selectedRing ? "#6ee7b7" : "#cbd5e1";
    g.fillText(`${rows[ri]?.icon ?? ""} ${rows[ri]?.name ?? ""}`, 20 * dpr, ly - 1 * dpr);
    ly += 14 * dpr;
  }

  if (selectedRing >= 0 && selectedRing < rings) {
    const rOut = outer - selectedRing * ringWidth;
    const rIn = rOut - ringWidth + 1 * dpr;
    g.strokeStyle = "#6ee7b7";
    g.lineWidth = 2.5 * dpr;
    g.beginPath();
    g.arc(cx, cy, rOut, 0, TAU);
    g.stroke();
    g.beginPath();
    g.arc(cx, cy, rIn, 0, TAU);
    g.stroke();
  }

  return L;
}

/**
 * @param {number} px device x
 * @param {number} py device y
 */
export function hitCircularSeq(px, py, w, h, rings, steps) {
  const { cx, cy, outer, innerPad, ringWidth } = circSeqLayout(w, h, rings, steps);
  const dx = px - cx;
  const dy = py - cy;
  const r = Math.hypot(dx, dy);
  if (r < innerPad * 0.95 || r > outer) return null;

  const ring = clamp(Math.floor((outer - r) / ringWidth), 0, rings - 1);
  let angle = Math.atan2(dy, dx) + Math.PI / 2;
  if (angle < 0) angle += TAU;
  const step = clamp(Math.floor((angle / TAU) * steps), 0, steps - 1);
  return { ring, step };
}

/** @param {number[][]} rows8 0/1 rows × 8 */
export function expandPattern8to16(rows8) {
  return rows8.map((row) => row.flatMap((v) => [!!v, !!v]));
}
