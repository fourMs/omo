/**
 * Workshop URL helpers — parts, sections, accessibility.
 */

export const SECTIONS = {
  drones: {
    name: "Drones",
    color: "#38bdf8",
    apps: ["drone-choir", "motion-wah", "compass-wah", "sound-saber"],
  },
  rhythm: {
    name: "Rhythm",
    color: "#fb923c",
    apps: ["drumkit", "drum-sequencer", "delay-throw"],
  },
  melody: {
    name: "Melody",
    color: "#a78bfa",
    apps: ["piano", "flute-blow", "mic-theremin", "synth-pad", "tilt-harp", "bow-phone"],
  },
  texture: {
    name: "Texture",
    color: "#6ee7b7",
    apps: ["granular-tilt", "sampler", "video-sonifier", "wavetable-scan"],
  },
  synthesis: {
    name: "Synthesis",
    color: "#f472b6",
    apps: ["fm-touch", "fm-matrix", "ks-string", "additive-bells", "filter-ladder", "supersaw-stack"],
  },
  ai: {
    name: "AI",
    color: "#fbbf24",
    apps: ["train-shake", "hum-clap"],
  },
};

/** Part cards for ?part=N (1–20). */
export const PARTS = Array.from({ length: 20 }, (_, i) => {
  const n = i + 1;
  const keys = Object.keys(SECTIONS);
  const section = keys[i % keys.length];
  const apps = SECTIONS[section].apps;
  const app = apps[i % apps.length];
  return { part: n, section, app, label: `Part ${n} · ${SECTIONS[section].name}` };
});

export function getPartFromUrl(search = location.search) {
  const p = new URLSearchParams(search).get("part");
  if (!p) return null;
  const n = parseInt(p, 10);
  return PARTS.find((x) => x.part === n) || null;
}

export function getSectionFromUrl(search = location.search) {
  return new URLSearchParams(search).get("section") || null;
}

/** Larger UI on every page (hub + instruments). */
export function loadA11yPreference() {
  document.documentElement.classList.add("omo-a11y");
}
