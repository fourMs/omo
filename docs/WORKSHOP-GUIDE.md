# Workshop guide — Oslo Mobile Orchestra

> Extended version with scenarios and assessment: **[GitHub Wiki → Workshop guide](https://github.com/alexarje/Oslo-Mobile-Orchestra/wiki/Workshop-Guide)**

## Goals

- **Play together** with phones only — no cables, minimal setup.
- **Hear different music-making modes**: harmony, rhythm, gesture, timbre.
- **See under the hood**: synthesis blocks, sensors as controllers, a tiny ML pipeline.

## Before the room (15 min)

1. Test Wi‑Fi or mobile hotspot; phones need the same host URL.
2. **Browsers:** iPhone/iPad → **Safari**; Android → **Chrome**. Avoid opening the link inside Instagram, email, or chat apps — use “Open in browser” if needed.
3. Conductor phone: full volume, Do Not Disturb on.
4. Pre-assign roles on a slide (optional): row A = drones, row B = rhythm, etc.
5. Demo once: **tap anywhere** on the app screen → allow mic or motion when prompted.

## Facilitator script (45 min)

### Warm-up (5 min)
Open hub → **Synth Pad**. Everyone finds one note. Conductor counts 1–2–3–4, all release on 4.

### Sensors (10 min)
**Motion Trump** — “Tilt = vowel.” Conductor points up/down; group sweeps together without looking at screens.

### AI (10 min)
**Train & Shake** — record **still**, **sway**, and **shake** (3+ each), or **Export set** / **Import set** for a shared demo. Open **Teach** (feature map + confusion matrix), try **k** slider and **Compare both** models.
- Ask: *What could confuse the model?* Read **Ethics · on-device** — bias across phones and bodies.
- Perform: conductor mimes three gestures; ensemble reacts (still = tone, sway = blended, shake = noise).

### Ensemble (15 min)
1. Conductor sets 96 BPM, **Start countdown**, share link (AirDrop, QR, shout URL shortener).
2. Drones: **Just Equal** — assign F / A♭ / C / E♭ counts (5 each).
3. Rhythm: **Drum Sequencer Linear/Circular**, **Drumkit**, or **Firefly** — split roles; Conductor link `start` + `bpm` if needed.
4. Optional **Harmonizer** — blend into room tonality; **Firefly** for pulse sync.
5. Texture: **Granular Tilt** or **Video Sonifier** behind the group.

### Cool-down (5 min)
All screens down; one sustained drone from a single phone. Discuss what felt “musical” vs “tech demo.”

## Accessibility

- Large touch targets (48px+); no fine motor precision required for drones and rhythm apps.
- **Train & Shake** can be adapted: relabel classes (e.g. “low” / “mid” / “high” phone position) — same three-button flow.
- Deaf/Hard of Hearing: visual readouts and step LEDs on sequencers where available.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Mic/camera/motion blocked | Use Safari (iOS) or Chrome (Android); not an in-app browser |
| No sound | Tap anywhere on the screen first; check mute switch (iOS) |
| Motion flat | Reload; Settings → Safari → Motion & Orientation |
| Out of sync | Use Conductor link; accept ~50–100 ms spread without server |
| Harsh room | Lower phone volume to 50%; fewer “shake” noise players |

## Assessment prompts (school / university)

1. Map **Synth Pad** controls to oscillator → filter signal chain.
2. Why is k-NN a form of **supervised learning**?
3. Compare **granular** clouds to **subtractive** pad — which fits ambient vs rhythmic roles?
