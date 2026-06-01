#!/usr/bin/env node
/**
 * Regenerate docs/wiki/App-Catalog.md from shared/hub-catalog.js.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://fourms.github.io/omo";

const WIKI_SECTIONS = [
  ["rhythm", "Rhythm"],
  ["drones", "Drones & filters"],
  ["melody", "Melody"],
  ["synthesis", "Synthesis"],
  ["texture", "Texture"],
  ["ai", "AI & learning"],
];

function parseCatalogEntries(catalog) {
  const entries = [];
  const re =
    /href:\s*"apps\/([^/]+)\/"[\s\S]*?title:\s*"([^"]*)"[\s\S]*?section:\s*"([^"]*)"[\s\S]*?synth:\s*"([^"]*)"[\s\S]*?sensors:\s*"([^"]*)"/g;
  for (const m of catalog.matchAll(re)) {
    entries.push({ slug: m[1], title: m[2], section: m[3], synth: m[4], sensors: m[5] });
  }
  return entries;
}

const catalog = fs.readFileSync(path.join(root, "shared/hub-catalog.js"), "utf8");
const entries = parseCatalogEntries(catalog);
const lines = [
  "# App catalog",
  "",
  `Live links use the [GitHub Pages site](${SITE}/) (same paths as the repo).`,
  "",
  `**${entries.length} apps** on the hub — source of truth: \`shared/hub-catalog.js\`. Folder names under \`apps/\` are kebab-case; titles are Title Case.`,
  "",
  "| Section | Count |",
  "|---------|------:|",
];

for (const [sec, label] of WIKI_SECTIONS) {
  const n = entries.filter((e) => e.section === sec).length;
  if (n) lines.push(`| ${label} | ${n} |`);
}
lines.push("", "## Playing surfaces", "", "| Pattern | Examples |", "|---------|----------|");
lines.push(
  "| Full pad / X–Y | Kaoss Pad, FM Touch, Pinch Bass |",
  "| Centre record button | Sampler, Scrub Tape, Wind Bottle, Vocoder Choir |",
  "| Hold pad | Shepard Glide, many drones |",
  "| Keyboard / sequencer | Piano, Markov Melody, drum sequencers |",
  ""
);

for (const [sec, label] of WIKI_SECTIONS) {
  const apps = entries.filter((e) => e.section === sec);
  if (!apps.length) continue;
  lines.push(`## ${label}`, "", "| App | Synth / role | Sensors |", "|-----|--------------|---------|");
  for (const a of apps.sort((x, y) => x.title.localeCompare(y.title))) {
    lines.push(`| [${a.title}](${SITE}/apps/${a.slug}/) | ${a.synth} | ${a.sensors} |`);
  }
  lines.push("");
}

lines.push(
  "## URL notes",
  "",
  "- **Motion Trump** → `apps/motion-wah/`",
  "- **KS String** → `apps/ks-string/` (older `ks-pluck` redirects)",
  "",
  "## Retired from hub",
  "",
  "Removed or stubbed experiments include One Shot Orchestra, Part, Pitch Hive, Pocket Metronome, Synth Pad, Tilt Doppler, Torch Pulse, Whisper Gate. Older stubs (Light Theremin, Grain Rain, etc.) redirect to the hub. See [Ideas](https://github.com/fourMs/omo/blob/main/docs/IDEAS.md) in the repo.",
  ""
);

const out = path.join(root, "docs/wiki/App-Catalog.md");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, lines.join("\n"));
console.log(`Wrote ${out} (${entries.length} apps)`);
