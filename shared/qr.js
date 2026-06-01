/**
 * Draw a QR code onto a canvas (Nayuki qrcodegen).
 */
import { qrcodegen } from "./qrcodegen.js";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} text
 * @param {object} [opts]
 * @param {number} [opts.scale=5]
 * @param {number} [opts.border=2]
 * @param {string} [opts.light="#f8fafc"]
 * @param {string} [opts.dark="#0f172a"]
 */
export function renderQrCanvas(canvas, text, opts = {}) {
  const scale = opts.scale ?? 5;
  const border = opts.border ?? 2;
  const light = opts.light ?? "#f8fafc";
  const dark = opts.dark ?? "#0f172a";
  const ecl = opts.ecl ?? qrcodegen.QrCode.Ecc.MEDIUM;
  const qr = qrcodegen.QrCode.encodeText(text, ecl);
  const width = (qr.size + border * 2) * scale;
  canvas.width = width;
  canvas.height = width;
  const ctx = canvas.getContext("2d");
  for (let y = -border; y < qr.size + border; y++) {
    for (let x = -border; x < qr.size + border; x++) {
      ctx.fillStyle = qr.getModule(x, y) ? dark : light;
      ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
    }
  }
  return qr;
}
