/**
 * Continuous Shepard tone — overlapping octave partials.
 */

/**
 * @param {AudioContext} ctx
 * @param {AudioNode} dest
 */
export function createShepardTone(ctx, dest) {
  const PARTIALS = 10;
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

  function update() {
    const t = ctx.currentTime;
    for (const v of voices) {
      const pos = (v.i + phase) % 1;
      const amp = Math.exp(-((pos - 0.5) ** 2) / 0.02);
      const freq = baseHz * 2 ** (v.i + phase);
      v.osc.frequency.setTargetAtTime(freq, t, 0.06);
      v.g.gain.setTargetAtTime(amp * 0.11, t, 0.05);
    }
  }

  function loop() {
    if (!running) return;
    phase += rate * direction * 0.012;
    update();
    raf = requestAnimationFrame(loop);
  }

  return {
    start() {
      running = true;
      bus.gain.setTargetAtTime(1, ctx.currentTime, 0.08);
      loop();
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
      bus.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
    },
    setRate(r) {
      rate = Math.max(0.02, Math.min(0.5, r));
    },
    setDirection(d) {
      direction = d >= 0 ? 1 : -1;
    },
    setLevel(level, when = ctx.currentTime) {
      bus.gain.setTargetAtTime(level, when, 0.05);
    },
  };
}
