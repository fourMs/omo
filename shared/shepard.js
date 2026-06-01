/**
 * Continuous Shepard tone — overlapping octave partials with log-frequency wrap.
 */

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 */
export function createShepardTone(ctx, dest) {
  const PARTIALS = 12;
  const OCTAVE_SPAN = 10;
  const baseHz = 55;
  const bus = ctx.createGain();
  bus.gain.value = 0;
  bus.connect(dest);
  const voices = [];

  for (let i = 0; i < PARTIALS; i++) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    g.gain.value = 0;
    osc.connect(g);
    g.connect(bus);
    osc.start();
    voices.push({ osc, g, i });
  }

  let phase = 0;
  let rate = 0.12;
  let direction = 1;
  let running = false;
  let raf = 0;
  let lastFrame = 0;

  function update() {
    const t = ctx.currentTime;
    for (const v of voices) {
      const logPos = (((v.i + phase) % OCTAVE_SPAN) + OCTAVE_SPAN) % OCTAVE_SPAN;
      const norm = logPos / OCTAVE_SPAN;
      const amp = Math.exp(-((norm - 0.5) ** 2) / 0.016);
      const freq = baseHz * 2 ** logPos;
      v.osc.frequency.setTargetAtTime(freq, t, 0.1);
      v.g.gain.setTargetAtTime(amp * 0.1, t, 0.08);
    }
  }

  function loop(now) {
    if (!running) return;
    if (!lastFrame) lastFrame = now;
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    phase += rate * direction * dt * 2.8;
    update();
    raf = requestAnimationFrame(loop);
  }

  return {
    start() {
      if (running) return;
      running = true;
      lastFrame = 0;
      cancelAnimationFrame(raf);
      const t = ctx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(Math.max(bus.gain.value, 0.001), t);
      bus.gain.setTargetAtTime(1, t, 0.06);
      update();
      loop(performance.now());
    },
    stop() {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
      raf = 0;
      const t = ctx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setTargetAtTime(0, t, 0.12);
    },
    setRate(r) {
      rate = Math.max(0.02, Math.min(0.55, r));
    },
    setDirection(d) {
      direction = d >= 0 ? 1 : -1;
    },
    setLevel(level, when = ctx.currentTime) {
      if (!running) return;
      bus.gain.setTargetAtTime(level, when, 0.05);
    },
    isRunning() {
      return running;
    },
  };
}
