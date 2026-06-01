/**
 * Simple mic onset detector for pulse / click entrainment.
 */

/**
 * @param {AudioContext} ctx
 * @param {MediaStream} stream
 * @param {{ onOnset: (time: number, strength: number) => void, minGap?: number }} opts
 */
export function createOnsetDetector(ctx, stream, { onOnset, minGap = 0.14 } = {}) {
  const src = ctx.createMediaStreamSource(stream);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 200;
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  src.connect(hp);
  hp.connect(analyser);

  const buf = new Float32Array(analyser.fftSize);
  let noise = 0.015;
  let lastOnset = 0;
  let prevRms = 0;
  let running = false;
  let raf = 0;

  function frame() {
    if (!running) return;
    analyser.getFloatTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);
    noise = noise * 0.992 + rms * 0.008;
    const now = ctx.currentTime;
    const thresh = noise * 2.6 + 0.006;
    if (rms > thresh && rms > prevRms * 1.015 && now - lastOnset >= minGap) {
      lastOnset = now;
      onOnset(now, rms);
    }
    prevRms = rms;
    raf = requestAnimationFrame(frame);
  }

  return {
    start() {
      if (running) return;
      running = true;
      frame();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    disconnect() {
      this.stop();
      try {
        src.disconnect();
      } catch {
        /* noop */
      }
    },
  };
}
