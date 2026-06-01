Static site on **GitHub Pages** — no backend required for performance.

## Layout

```
index.html          Hub (app list, PWA, a11y toggle)
apps/<name>/        One HTML page per instrument (+ occasional .js)
shared/             Audio, UI, sensors, ML, QR, domain modules
docs/               Workshop guide, ideas, wiki source (docs/wiki/)
sw.js               Service worker cache (versioned)
```

## Shared modules (selected)

| Module | Role |
|--------|------|
| `app.js` | Learn panel, Audio on/off, **QR share**, status helpers |
| `audio.js` | AudioContext unlock, master bus, mic stream |
| `sensors.js` | Motion / orientation with iOS permission flow |
| `drum-sounds.js` | Synthesized kicks, snares, hats |
| `ks.js` | Karplus–Strong voice pool |
| `ml.js` | k-NN + tiny net for Teach & Shake |
| `pulse-sync.js` / `onset-detect.js` | Firefly |
| `harmony-sync.js` / `chroma-detect.js` | Harmonizer |
| `evo-pattern.js` | Genetic drum patterns |
| `circular-seq.js` | Circular sequencer draw/hit-test |
| `compass-rose.js` / `motion-express.js` / `tilt-amp.js` | Compass apps |
| `hand-bow.js` | Bow Phone camera bow |
| `qr.js` + `qrcodegen.js` | QR rendering |

## App pattern

Typical instrument:

1. `bindLearn()` → header controls.
2. `registerAudioBoot(buildGraph, { mic: true })` optional.
3. Touch / sensor loop with Web Audio nodes.
4. No build step — native ES modules.

## PWA

- `manifest.webmanifest` + `sw.js` cache key `omo-v13` (bump when shared assets change).
- Installable; offline for cached assets.

## Deploy

GitHub Actions workflow `pages.yml` publishes `main` to GitHub Pages.

## Wiki

Source copies live in `docs/wiki/`. Published wiki: https://github.com/alexarje/Oslo-Mobile-Orchestra/wiki

To update the wiki from maintainer machine:

```bash
git clone https://github.com/alexarje/Oslo-Mobile-Orchestra.wiki.git
cp docs/wiki/*.md Oslo-Mobile-Orchestra.wiki/
cd Oslo-Mobile-Orchestra.wiki && git add -A && git commit -m "Sync wiki" && git push
```

## License

GPL-3.0
