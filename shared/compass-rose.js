/**
 * Draw a compass rose on a 2D canvas context (device pixels).
 * @param {CanvasRenderingContext2D} g
 * @param {number} w
 * @param {number} h
 * @param {number} dpr
 * @param {{ heading?: number, beta?: number, pitchT?: number | null, showPitchLane?: boolean, touchPitch?: boolean }} opts
 */
export function drawCompassRose(g, w, h, dpr, opts = {}) {
  const heading = ((opts.heading ?? 0) % 360 + 360) % 360;
  const bVal = typeof opts.beta === "number" && Number.isFinite(opts.beta) ? opts.beta : 90;
  const flat = Math.abs(bVal - 90) < 22;
  const showPitchLane = !!opts.showPitchLane;
  const pitchT = opts.pitchT;
  const touchPitch = !!opts.touchPitch;

  const cx = w / 2;
  const cy = h / 2;
  const r = Math.min(w, h) * 0.38;

  const headingRad = (deg) => ((deg - 90) * Math.PI) / 180;
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = "#0f172a";
  g.fillRect(0, 0, w, h);

  if (showPitchLane && typeof pitchT === "number") {
    const laneTop = cy - r * 0.62;
    const laneBot = cy + r * 0.62;
    g.strokeStyle = "#475569";
    g.lineWidth = 2 * dpr;
    g.beginPath();
    g.moveTo(cx, laneTop);
    g.lineTo(cx, laneBot);
    g.stroke();
    const pitchY = laneBot - pitchT * (laneBot - laneTop);
    g.fillStyle = touchPitch ? "rgba(110, 231, 183, 0.45)" : "rgba(110, 231, 183, 0.22)";
    g.beginPath();
    g.arc(cx, pitchY, 10 * dpr, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "#cbd5e1";
    g.font = `600 ${10 * dpr}px system-ui,sans-serif`;
    g.textAlign = "center";
    g.textBaseline = "bottom";
    g.fillText("pitch", cx, laneTop - 4 * dpr);
  }

  g.strokeStyle = flat ? "#6ee7b7" : "#fbbf24";
  g.lineWidth = 3 * dpr;
  g.beginPath();
  g.arc(cx, cy, r + 6 * dpr, 0, Math.PI * 2);
  g.stroke();

  g.fillStyle = "#1e293b";
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2);
  g.fill();

  g.strokeStyle = "#94a3b8";
  g.lineWidth = 2 * dpr;
  g.beginPath();
  g.arc(cx, cy, r, 0, Math.PI * 2);
  g.stroke();

  const cardinals = [
    { deg: 0, label: "N", major: true },
    { deg: 45, label: "NE", major: false },
    { deg: 90, label: "E", major: true },
    { deg: 135, label: "SE", major: false },
    { deg: 180, label: "S", major: true },
    { deg: 225, label: "SW", major: false },
    { deg: 270, label: "W", major: true },
    { deg: 315, label: "NW", major: false },
  ];

  for (let d = 0; d < 360; d += 10) {
    const rad = headingRad(d);
    const major = d % 30 === 0;
    const inner = r - (major ? 16 : 9) * dpr;
    const outer = r - 3 * dpr;
    g.strokeStyle = major ? "#cbd5e1" : "#64748b";
    g.lineWidth = (major ? 2.5 : 1.2) * dpr;
    g.beginPath();
    g.moveTo(cx + Math.cos(rad) * inner, cy + Math.sin(rad) * inner);
    g.lineTo(cx + Math.cos(rad) * outer, cy + Math.sin(rad) * outer);
    g.stroke();
  }

  g.textAlign = "center";
  g.textBaseline = "middle";
  for (const { deg, label, major } of cardinals) {
    const rad = headingRad(deg);
    const lr = r - 26 * dpr;
    g.font = `${major ? 600 : 500} ${(major ? 13 : 9) * dpr}px system-ui,sans-serif`;
    g.fillStyle = label === "N" ? "#f87171" : major ? "#f8fafc" : "#94a3b8";
    if (major || label.length === 2) g.fillText(label, cx + Math.cos(rad) * lr, cy + Math.sin(rad) * lr);
  }

  const pan = Math.sin((heading * Math.PI) / 180);
  g.fillStyle = pan < 0 ? "rgba(56, 189, 248, 0.15)" : "rgba(56, 189, 248, 0.04)";
  g.beginPath();
  g.moveTo(cx, cy);
  g.arc(cx, cy, r * 0.5, headingRad(180), headingRad(270));
  g.closePath();
  g.fill();
  g.fillStyle = pan > 0 ? "rgba(56, 189, 248, 0.15)" : "rgba(56, 189, 248, 0.04)";
  g.beginPath();
  g.moveTo(cx, cy);
  g.arc(cx, cy, r * 0.5, headingRad(270), headingRad(360));
  g.closePath();
  g.fill();

  const a = headingRad(heading);
  g.strokeStyle = "#6ee7b7";
  g.fillStyle = "#6ee7b7";
  g.lineWidth = 4 * dpr;
  g.lineCap = "round";
  g.beginPath();
  g.moveTo(cx, cy);
  g.lineTo(cx + Math.cos(a) * (r - 22 * dpr), cy + Math.sin(a) * (r - 22 * dpr));
  g.stroke();

  const tipX = cx + Math.cos(a) * (r - 12 * dpr);
  const tipY = cy + Math.sin(a) * (r - 12 * dpr);
  const wing = 12 * dpr;
  const aw = a + Math.PI / 2;
  g.beginPath();
  g.moveTo(tipX, tipY);
  g.lineTo(tipX - Math.cos(a) * wing + Math.cos(aw) * 6 * dpr, tipY - Math.sin(a) * wing + Math.sin(aw) * 6 * dpr);
  g.lineTo(tipX - Math.cos(a) * wing - Math.cos(aw) * 6 * dpr, tipY - Math.sin(a) * wing - Math.sin(aw) * 6 * dpr);
  g.closePath();
  g.fill();

  g.fillStyle = "#0f172a";
  g.strokeStyle = "#6ee7b7";
  g.lineWidth = 2 * dpr;
  g.beginPath();
  g.arc(cx, cy, 20 * dpr, 0, Math.PI * 2);
  g.fill();
  g.stroke();
  g.fillStyle = "#f8fafc";
  g.font = `bold ${12 * dpr}px system-ui,sans-serif`;
  g.fillText(`${heading.toFixed(0)}°`, cx, cy);

  const tiltT = clamp((bVal - 25) / 110, 0, 1);
  const bubbleX = cx - r * 0.7;
  const bubbleY = cy + r * 0.12 + (1 - tiltT) * r * 0.38;
  g.strokeStyle = "#64748b";
  g.lineWidth = 2 * dpr;
  g.beginPath();
  g.arc(bubbleX, cy + r * 0.38, r * 0.24, Math.PI * 0.15, Math.PI * 0.85);
  g.stroke();
  g.fillStyle = flat ? "#6ee7b7" : "#fbbf24";
  g.beginPath();
  g.arc(bubbleX, bubbleY, 7 * dpr, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#cbd5e1";
  g.font = `600 ${9 * dpr}px system-ui,sans-serif`;
  g.fillText(flat ? "flat" : "tilt", bubbleX, cy + r * 0.38 + r * 0.3);
}

/** Size canvas to parent and return { w, h, dpr }. */
export function sizeCompassCanvas(canvas, parentEl = canvas.parentElement) {
  const box = parentEl.getBoundingClientRect();
  const dpr = devicePixelRatio || 1;
  const w = Math.max(1, Math.floor(box.width * dpr));
  const h = Math.max(1, Math.floor(box.height * dpr));
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  return { w, h, dpr };
}
