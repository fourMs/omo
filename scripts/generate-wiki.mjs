#!/usr/bin/env node
/**
 * Regenerate the app catalogs from shared/hub-catalog.js:
 *   - docs/wiki/App-Catalog.md (absolute site links, for the GitHub wiki)
 *   - docs/CATALOG.md          (relative links + folder slugs, in-repo mirror)
 * Run after editing hub-catalog.js: node scripts/generate-wiki.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://fourms.github.io/omo";
const BOOK = "https://fourms.github.io/sensingsoundandmusic";

const WIKI_SECTIONS = [
  ["rhythm", "Rhythm"],
  ["drones", "Drones & motion"],
  ["melody", "Melody"],
  ["synthesis", "Synthesis"],
  ["texture", "Texture"],
  ["ai", "AI & learning"],
];

// Consolidated instruments: legacy folders redirect to a canonical app.
const REDIRECTS = [
  ["audience", "green-button", ""],
  ["circular-drum", "rhythm-machine", "?gen=draw"],
  ["color-band", "video-sonifier", ""],
  ["drone-choir", "just-equal", ""],
  ["edge-strum", "ks-string", ""],
  ["euclidean-rings", "rhythm-machine", "?gen=euclid"],
  ["filter-ladder", "motion-filter", "?mode=ladder"],
  ["flat-edge", "motion-filter", "?mode=flat"],
  ["fm-matrix", "synth-tour", "?engine=fm"],
  ["fm-touch-tilt", "fm-touch", "?mod=tilt"],
  ["gyro-whirl", "synth-tour", "?engine=supersaw&timbre=spin"],
  ["heading-choir", "compass-wah", "?mode=choir"],
  ["hold-loop-tilt", "sampler", ""],
  ["ks-pluck", "ks-string", ""],
  ["lsystem-groove", "rhythm-machine", "?gen=lsystem"],
  ["motion-grid", "video-sonifier", ""],
  ["motion-wah", "motion-filter", "?mode=tilt"],
  ["am-radio", "synth-tour", "?engine=am"],
  ["phase-distortion", "synth-tour", "?engine=pd"],
  ["ring-mod-gong", "synth-tour", "?engine=ring"],
  ["shake-filter", "motion-filter", "?mode=shake"],
  ["spectral-soup", "spectral-freeze", "?mode=soup"],
  ["supersaw-stack", "synth-tour", "?engine=supersaw"],
  ["wavetable-scan", "synth-tour", "?engine=wavetable"],
];

// Import the catalog module directly — no fragile regex parsing.
const { HUB_APPS } = await import(pathToFileURL(path.join(root, "shared/hub-catalog.js")).href);
const entries = HUB_APPS.map((a) => ({
  slug: a.href.match(/apps\/([^/]+)\//)[1],
  title: a.title,
  section: a.section,
  synth: a.synth,
  sensors: a.sensors,
  teaches: a.teaches || "",
}));

function catalogLines({ site }) {
  const appLink = (a) => (site ? `[${a.title}](${SITE}/apps/${a.slug}/)` : `[${a.title}](../apps/${a.slug}/)`);
  const lines = [
    "# App catalog",
    "",
    site
      ? `Live links use the [GitHub Pages site](${SITE}/) (same paths as the repo).`
      : `Complete list of instruments on the [hub](${SITE}/).`,
    "",
    `${entries.length} apps on the hub. Source of truth: \`shared/hub-catalog.js\`; this file is generated from it by \`scripts/generate-wiki.mjs\`. Folder names under \`apps/\` are kebab-case; titles are Title Case.`,
    "",
    `The Teaches column names the main concept and the matching chapter of [Sensing Sound and Music](${BOOK}/).`,
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
    "| Full pad / X–Y | Kaoss Pad, FM Touch, Pinch Bass, Synth Tour |",
    "| Centre record button | Sampler, Scrub Tape, Wind Bottle, Vocoder Choir |",
    "| Hold pad | Shepard Glide, Motion Filter, many drones |",
    "| Hold still | Standstill, Micromotion (inverse: movement silences) |",
    "| Keyboard / sequencer | Piano, Markov Melody, Rhythm Machine |",
    ""
  );

  for (const [sec, label] of WIKI_SECTIONS) {
    const apps = entries.filter((e) => e.section === sec);
    if (!apps.length) continue;
    lines.push(
      `## ${label}`,
      "",
      site
        ? "| App | Synth / role | Sensors | Teaches |"
        : "| App | Folder | Synth / role | Sensors | Teaches |",
      site ? "|-----|--------------|---------|---------|" : "|-----|--------|--------------|---------|---------|"
    );
    for (const a of apps.sort((x, y) => x.title.localeCompare(y.title))) {
      lines.push(
        site
          ? `| ${appLink(a)} | ${a.synth} | ${a.sensors} | ${a.teaches} |`
          : `| ${appLink(a)} | \`${a.slug}\` | ${a.synth} | ${a.sensors} | ${a.teaches} |`
      );
    }
    lines.push("");
  }

  lines.push(
    "## Consolidated instruments (legacy URLs redirect)",
    "",
    "Several earlier apps became modes of a canonical instrument. Old links and QR codes keep working:",
    "",
    "| Old app | Now |",
    "|---------|-----|"
  );
  for (const [from, to, q] of REDIRECTS) {
    const target = site ? `[\`${to}/${q}\`](${SITE}/apps/${to}/${q.replace(/&/g, "&amp;")})` : `\`${to}/${q}\``;
    lines.push(`| \`${from}\` | ${target} |`);
  }
  lines.push(
    "",
    "## Retired from hub",
    "",
    "Removed or stubbed experiments include One Shot Orchestra, Part, Pitch Hive, Pocket Metronome, Synth Pad, Tilt Doppler, Torch Pulse, Whisper Gate, Light Theremin, Grain Rain, Haptic Click, Battery Drone, Geo Drone, Pressure Pad, PWM Bass, Hard Sync Lead, IR Cathedral, Live Loop Slicer. See [Ideas](https://github.com/fourMs/omo/blob/main/docs/IDEAS.md) in the repo.",
    ""
  );
  return lines;
}

const wikiOut = path.join(root, "docs/wiki/App-Catalog.md");
fs.mkdirSync(path.dirname(wikiOut), { recursive: true });
fs.writeFileSync(wikiOut, catalogLines({ site: true }).join("\n"));
console.log(`Wrote ${wikiOut} (${entries.length} apps)`);

const repoOut = path.join(root, "docs/CATALOG.md");
fs.writeFileSync(repoOut, catalogLines({ site: false }).join("\n"));
console.log(`Wrote ${repoOut} (${entries.length} apps)`);
