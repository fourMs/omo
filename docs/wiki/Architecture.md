# Architecture

Overview of how the [fourMs/omo](https://github.com/fourMs/omo) repository is organized.

## Layout

```
omo/
├── index.html          # Hub (lists HUB_APPS)
├── support.html        # Sensor feature detect
├── sw.js               # Service worker + cache version
├── manifest.webmanifest
├── shared/             # UI, audio, sensors, ML, sync helpers
└── apps/<slug>/        # One folder per instrument (index.html + app.js)
```

Each instrument is a **static page**: HTML shell, `shared/app.js` for header (Learn, QR, Audio), and an app-specific script.

## Hub catalog

`shared/hub-catalog.js` exports `HUB_APPS` — title, section, synthesis blurb, sensors, and `href`. The hub, wiki [App catalog](App-Catalog), and `docs/CATALOG.md` should stay aligned; regenerate wiki tables with:

```bash
node scripts/generate-wiki.mjs
```

Title Case names can be synced from folder slugs:

```bash
node scripts/sync-titles-from-slugs.mjs
```

## Shared modules (selected)

| Module | Role |
|--------|------|
| `audio.js` | AudioContext unlock, master gain |
| `sensors.js` | Motion, mic, compass wrappers |
| `hold-play.js` | Hold-to-sound pad pattern |
| `shepard.js` | Log-frequency Shepard glide |
| `pulse-sync.js` | Firefly entrainment |
| `harmony-sync.js` | Chroma following |
| `ml.js` | k-NN / feature helpers for AI apps |
| `workshop.js` | Hub `?section=` filter, section colours |
| `learn-pedagogy.js` | Learn overlay copy per app |

## App shell UI

- **Learn** — `bindLearn()` + pedagogy JSON per slug
- **QR** — encodes the current instrument URL (`shared/qr.js`)
- **Audio on** — user gesture unlock for iOS

Many apps use `body.app-shell` and put live readouts in `control-row` (not hidden `readout-row`).

## PWA & offline

- `manifest.webmanifest` — name, icons, `display: standalone`
- `sw.js` — `CACHE = "omo-vNN"`; bump when shared assets or hub logic change
- Install path: Safari / Chrome → **Add to Home Screen**

Cached assets include hub, `support.html`, and common `shared/*` modules — not every app bundle. First visit to an app still fetches that app's `index.html` and `app.js`; repeat visits benefit from browser cache + SW.

## Deployment

GitHub Pages serves from the `main` branch at [fourms.github.io/omo/](https://fourms.github.io/omo/).

## Wiki maintenance

Wiki sources live in `docs/wiki/` in the repo. Push to GitHub Wiki:

```bash
./scripts/push-wiki.sh
```

Requires `gh auth login` or `GH_TOKEN` with repo scope.
