#!/usr/bin/env node
/**
 * Set instrument display titles to Title Case folder slugs (hub, apps, docs).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { slugToTitle } from "../shared/hub-catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export { slugToTitle };

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

function updateHubCatalog() {
  const file = path.join(root, "shared/hub-catalog.js");
  let catalog = fs.readFileSync(file, "utf8");
  catalog = catalog.replace(
    /(href:\s*"apps\/([^/]+)\/"[\s\S]*?title:\s*)"([^"]*)"/g,
    (_, pre, slug) => `${pre}"${slugToTitle(slug)}"`
  );
  catalog = catalog.replace(
    /^\/\*\*\n \* Hub instrument list[^\n]*\n \*\/\n/m,
    "/**\n * Hub instrument list — titles match folder slugs (Title Case).\n */\n"
  );
  fs.writeFileSync(file, catalog);
  return catalog;
}

function updateAppHtml() {
  const appsDir = path.join(root, "apps");
  for (const slug of fs.readdirSync(appsDir)) {
    const htmlPath = path.join(appsDir, slug, "index.html");
    if (!fs.existsSync(htmlPath)) continue;
    let html = fs.readFileSync(htmlPath, "utf8");
    if (html.includes("<title>Removed — OMO</title>")) continue;
    const title = slugToTitle(slug);
    html = html.replace(/<title>[^<]* — OMO<\/title>/, `<title>${title} — OMO</title>`);
    html = html.replace(/(<h1>)[^<]*(<\/h1>)/, `$1${title}$2`);
    fs.writeFileSync(htmlPath, html);
  }
}

function updateReadme(entries) {
  const file = path.join(root, "README.md");
  let md = fs.readFileSync(file, "utf8");
  const sections = [
    ["rhythm", "Rhythm"],
    ["drones", "Drones"],
    ["melody", "Melody"],
    ["synthesis", "Synthesis"],
    ["texture", "Texture"],
    ["ai", "AI"],
  ];
  for (const [sec, label] of sections) {
    const links = entries
      .filter((e) => e.section === sec)
      .map((e) => `[${e.title}](apps/${e.slug}/)`)
      .join(" · ");
    md = md.replace(
      new RegExp(`\\| \\*\\*${label}\\*\\* \\| [^|\\n]+ \\|`),
      `| **${label}** | ${links} |`
    );
  }
  fs.writeFileSync(file, md);
}

function updateWikiCatalog(entries) {
  const file = path.join(root, "docs/wiki/App-Catalog.md");
  const lines = [
    "Live links use the [GitHub Pages site](" + SITE + "/) (same paths as the repo).",
    "Instrument **titles match folder names** (Title Case slugs under `apps/`).",
    "",
  ];
  for (const [sec, label] of WIKI_SECTIONS) {
    const apps = entries.filter((e) => e.section === sec);
    if (!apps.length) continue;
    lines.push(`## ${label}`, "", "| App | Synth / role | Sensors |", "|-----|--------------|---------|");
    for (const a of apps) {
      lines.push(
        `| [${a.title}](${SITE}/apps/${a.slug}/) | ${a.synth} | ${a.sensors} |`
      );
    }
    lines.push("");
  }
  lines.push(
    "## Removed apps",
    "",
    "Some older experiments redirect to the hub (`index.html` stub). Examples: Light Theremin, Grain Rain, Live Loop Slicer, IR Cathedral, Hard Sync Lead, Haptic Click, Geo Drone. **Audience** redirects to **Green Button** (`apps/green-button/`).",
    ""
  );
  fs.writeFileSync(file, lines.join("\n"));
}

function bumpSwCache() {
  const file = path.join(root, "sw.js");
  let sw = fs.readFileSync(file, "utf8");
  const m = sw.match(/const CACHE = "omo-v(\d+)"/);
  if (m) {
    const next = Number(m[1]) + 1;
    sw = sw.replace(/const CACHE = "omo-v\d+"/, `const CACHE = "omo-v${next}"`);
    fs.writeFileSync(file, sw);
  }
}

const catalog = updateHubCatalog();
updateAppHtml();
const entries = parseCatalogEntries(catalog);
updateReadme(entries);
updateWikiCatalog(entries);
bumpSwCache();
console.log(`Updated ${entries.length} catalog titles from folder slugs.`);
