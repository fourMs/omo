# Workshop guide — Oslo Mobile Orchestra

> Extended version with scenarios and assessment: **[GitHub Wiki → Workshop guide](https://github.com/fourMs/omo/wiki/Workshop-Guide)**

## Goals

- **Play together** with phones only — no cables, minimal setup.
- **Hear different music-making modes**: harmony, rhythm, gesture, timbre.
- **See under the hood**: synthesis blocks, sensors as controllers, a tiny on-device ML pipeline.

## Before the room (15 min)

1. Test Wi‑Fi or mobile hotspot; everyone opens the same site URL.
2. **Browsers:** iPhone/iPad → **Safari**; Android → **Chrome**. Avoid in-app browsers — use “Open in browser”.
3. Conductor phone: full volume, Do Not Disturb on.
4. Optional: filter the hub by section (`?section=rhythm`, etc.) or pre-assign rows (drones / rhythm / melody).
5. Run through **[Device support](../support.html)** on one phone; allow motion when **Test motion** is tapped.
6. Demo flow: open an app → **Audio on** → touch the play surface → allow mic/motion if asked.

## Facilitator script (45 min)

### Warm-up (5 min)

Open hub → **Piano** (or **Kaoss Pad** on Lead program). Everyone finds one note or pad position. Conductor counts 1–2–3–4; all release on 4.

### Sensors (10 min)

**Motion Filter** (`apps/motion-filter/`) — “Tilt = vowel.” Conductor points up/down; group sweeps together without looking at screens. Switch the mapping (Tilt · Shake · Ladder · Flat) and repeat: same synth, new instrument.

**Shepard Glide** — hold the pad; tilt controls rise/fall speed. Discuss endless glide vs stepped melody.

### Texture & sampling (5 min, optional)

**Sampler** — hold centre **record** button, hum or speak, release to loop; tilt shifts colour and filter.

**Scrub Tape** — record, then drag the **tape ribbon** at the bottom (DJ scrub).

### Stillness (optional, 10 min)

**Standstill** — everyone holds the phone to the chest and stands still; sound blooms with stillness and any movement silences it. Run one 3-minute **Championship** heat. **Micromotion** splits what remains into sway, tremor, and rotation lanes. Full script and background: **[Micromotion & Sonification](https://github.com/fourMs/omo/wiki/Micromotion-and-Sonification)**.

### AI (10 min)

**Train & Shake** — record **still**, **sway**, and **shake** (3+ each), or **Export set** / **Import set** for a shared demo. Open **Teach** (feature map + confusion matrix), try **k** and **Compare both** models.

- Ask: *What could confuse the model?* Read **Ethics · on-device** — bias across phones and bodies.
- Perform: conductor mimes three gestures; ensemble reacts.

### Ensemble (15 min)

1. **Conductor** — set BPM, **Start countdown**, share link (QR, AirDrop, or short URL).
2. **Drones** — **Just Equal** or **Harmonizer**; assign roots (e.g. F / A♭ / C / E♭).
3. **Rhythm** — split **Drum Sequencer**, **Rhythm Machine** (Draw, Euclid, or L-system), **Drumkit**, or **Firefly**.
4. **Melody** — **Markov Melody**, **Kaoss Pad** (Beat program for pulse layer), or **Mic Theremin**.
5. **Texture** — **Granular Tilt**, **Video Sonifier**, or **Vocoder Choir** (hold centre button, sing).

### Cool-down (5 min)

One phone on **Shepard Glide** or **Just Equal**; others silent. Discuss what felt musical vs “tech demo.”

## Suggested role map (49 apps)

| Role | Good starting apps |
|------|-------------------|
| Pulse / time | Conductor, Firefly, Clap Architect |
| Grid rhythm | Drumkit, Drum Sequencer, Rhythm Machine |
| Drones / harmony | Just Equal, Harmonizer, Compass Wah (Choir), Swarm Bloom |
| Motion expression | Motion Filter, Sound Saber, Shepard Glide, Pinch Bass |
| Stillness / micromotion | Standstill, Micromotion |
| Melody / pitch | Piano, Kaoss Pad, Markov Melody, Flute Blow, Mic Theremin |
| Timbre / FX | Sampler, Scrub Tape, Granular Tilt, Synth Tour, Pluck Bowl |
| Camera / room | Shadow Sequencer, Video Sonifier, Room Reverb Send |
| Mapping design | Mapping Roulette, Motion Filter, Pinch Bass |
| ML showcase | Train Shake, Hum Clap, Evo Drumkit, Gesture Regression |

Full list: [CATALOG.md](CATALOG.md).

## Accessibility

- Large touch targets; centre record buttons are ~5 cm on most phones.
- **Train & Shake** classes can be relabelled (e.g. phone low / mid / high).
- Sequencers and live readouts give visual feedback; Firefly flashes on pulse.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Mic/camera/motion blocked | Safari (iOS) or Chrome (Android); not an in-app browser |
| No sound | **Audio on**; tap play surface; check mute switch (iOS) |
| Shepard stops while holding | Reload page (cache update); keep finger on pad, not edge |
| Motion flat | Reload; iOS Settings → Safari → Motion & Orientation |
| Out of sync | Conductor shared link; expect ~50–100 ms spread without a server |
| Harsh room | Lower volume; fewer distortion / shake players |

## Assessment prompts (school / university)

1. Map **FM Touch** or **Motion Filter → Ladder** to oscillator → filter → output. Where is the sensor in the chain?
2. Why is k-NN (**Hum Clap**, **Train Shake**) a form of supervised learning?
3. Compare **Granular Tilt** (cloud texture) to **Pluck Bowl** (resonant strikes) — ambient vs rhythmic roles?
4. **Kaoss Pad**: how does quantizing pitch on X differ from free pitch on **Mic Theremin**?
5. **Sampler** / **Scrub Tape**: what is stored in the audio buffer, and what does scrubbing change?
