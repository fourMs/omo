/**
 * Simple pitch detection from time-domain buffer (autocorrelation).
 */

export function detectPitchHz(samples, sampleRate, minHz = 80, maxHz = 1200) {
  const n = samples.length;
  if (n < 256) return null;
  const minLag = Math.floor(sampleRate / maxHz);
  const maxLag = Math.min(Math.floor(sampleRate / minHz), n - 1);
  let bestLag = minLag;
  let bestCorr = -1;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let sum = 0;
    const len = n - lag;
    for (let i = 0; i < len; i++) sum += samples[i] * samples[i + lag];
    if (sum > bestCorr) {
      bestCorr = sum;
      bestLag = lag;
    }
  }
  if (bestCorr < 0.0008) return null;
  return sampleRate / bestLag;
}

export function hzToMidi(hz) {
  return 69 + 12 * Math.log2(hz / 440);
}

export function midiToHz(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}
