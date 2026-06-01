/**
 * Build a 12-bin chroma profile from FFT peaks (many partials → one histogram).
 */

import { hzToMidi } from "./pitch.js";

/**
 * @param {AnalyserNode} analyser
 * @param {number} sampleRate
 * @returns {{ chroma: Float32Array, peakCount: number }}
 */
export function chromaFromSpectrum(analyser, sampleRate) {
  const bins = analyser.frequencyBinCount;
  const nyquist = sampleRate / 2;
  const chroma = new Float32Array(12);
  let peakCount = 0;

  const byte = new Uint8Array(bins);
  analyser.getByteFrequencyData(byte);
  const minMag = 12;

  for (let i = 2; i < bins - 2; i++) {
    const v = byte[i];
    if (v < minMag) continue;
    if (v < byte[i - 1] || v < byte[i + 1]) continue;

    const hz = (i * nyquist) / bins;
    if (hz < 65 || hz > 4200) continue;

    const midi = hzToMidi(hz);
    const pc = ((Math.round(midi) % 12) + 12) % 12;
    chroma[pc] += v / 255;
    peakCount++;
  }

  if (peakCount > 0) return { chroma, peakCount };

  const mag = new Float32Array(bins);
  analyser.getFloatFrequencyData(mag);
  const minDb = -68;
  for (let i = 2; i < bins - 2; i++) {
    const db = mag[i];
    if (db < minDb) continue;
    if (db < mag[i - 1] || db < mag[i + 1]) continue;
    const hz = (i * nyquist) / bins;
    if (hz < 65 || hz > 4200) continue;
    const midi = hzToMidi(hz);
    const pc = ((Math.round(midi) % 12) + 12) % 12;
    chroma[pc] += Math.pow(10, db / 20);
    peakCount++;
  }

  return { chroma, peakCount };
}
