/**
 * Workshop URL helpers — sections, accessibility.
 */

export const SECTIONS = {
  drones: {
    name: "Drones",
    color: "#38bdf8",
    apps: ["just-equal", "motion-wah", "compass-wah", "sound-saber"],
  },
  rhythm: {
    name: "Rhythm",
    color: "#fb923c",
    apps: ["drumkit", "drum-sequencer", "delay-throw", "clix"],
  },
  melody: {
    name: "Melody",
    color: "#a78bfa",
    apps: ["piano", "flute-blow", "mic-theremin", "tilt-harp", "bow-phone", "kaoss-pad", "crystalis"],
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

export function getSectionFromUrl(search = location.search) {
  return new URLSearchParams(search).get("section") || null;
}

/** Larger UI on every page (hub + instruments). */
export function loadA11yPreference() {
  document.documentElement.classList.add("omo-a11y");
}
