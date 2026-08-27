# Workshop guide

Facilitator notes for a 45-minute OMO session with phones only. Shorter checklist in the repo: [`docs/WORKSHOP-GUIDE.md`](https://github.com/fourMs/omo/blob/main/docs/WORKSHOP-GUIDE.md).

## Goals

- Play together with phones only: no cables, minimal setup.
- Hear different music-making modes: harmony, rhythm, gesture, timbre.
- See under the hood: synthesis blocks, sensors as controllers, a tiny on-device ML pipeline.

## Before the room (15 min)

1. Test Wi‑Fi or mobile hotspot; everyone opens [fourms.github.io/omo/](https://fourms.github.io/omo/).
2. Browsers: iPhone/iPad → Safari; Android → Chrome. Avoid in-app browsers; use “Open in browser”.
3. Conductor phone: full volume, Do Not Disturb on.
4. Optional: filter the hub by section (`?section=rhythm`, etc.) or pre-assign rows (drones / rhythm / melody).
5. Run through [Device support](https://fourms.github.io/omo/support.html) on one phone; allow motion when Test motion is tapped.
6. Demo flow: open an app → Audio on → touch the play surface → allow mic/motion if asked.

## Facilitator script (45 min)

### Warm-up (5 min)

Open hub → [Piano](https://fourms.github.io/omo/apps/piano/) (or [Kaoss Pad](https://fourms.github.io/omo/apps/kaoss-pad/) on Lead program). Everyone finds one note or pad position. Conductor counts 1–2–3–4; all release on 4.

### Sensors (10 min)

[Motion Filter](https://fourms.github.io/omo/apps/motion-filter/): “Tilt = vowel.” Conductor points up/down; group sweeps together without looking at screens. Switch the mapping (Tilt · Shake · Ladder · Flat) and repeat: same synth, new instrument.

[Shepard Glide](https://fourms.github.io/omo/apps/shepard-glide/): hold the pad; tilt controls rise/fall speed. Discuss endless glide vs stepped melody. If tone stops while held, reload (service worker update) and keep finger on the pad centre.

### Texture & sampling (5 min, optional)

[Sampler](https://fourms.github.io/omo/apps/sampler/): hold centre record button, hum or speak, release to loop; tilt shifts colour and filter.

[Scrub Tape](https://fourms.github.io/omo/apps/scrub-tape/): record, then drag the tape ribbon at the bottom (DJ scrub).

[Pinch Bass](https://fourms.github.io/omo/apps/pinch-bass/): two-finger spread on the pad; watch the live readout for filter and pitch.

### Stillness (optional, 10 min)

[Standstill](https://fourms.github.io/omo/apps/standstill/): everyone holds the phone to the chest and stands still; sound blooms with stillness and any movement silences it. Run one 60-second Championship heat. [Micromotion](https://fourms.github.io/omo/apps/micromotion/) splits what remains into sway, tremor, and rotation lanes. Full script and background: [Micromotion & Sonification](https://github.com/fourMs/omo/wiki/Micromotion-and-Sonification).

### AI (10 min)

[Train & Shake](https://fourms.github.io/omo/apps/train-shake/): record still, sway, and shake (3+ each), or Export set / Import set for a shared demo. Open Teach (feature map + confusion matrix), try k and Compare both models.

- Ask: *What could confuse the model?* Read Ethics · on-device: bias across phones and bodies.
- Perform: conductor mimes three gestures; ensemble reacts.

### Ensemble (15 min)

1. [Conductor](https://fourms.github.io/omo/apps/conductor/): set BPM, Start countdown, share link (QR, AirDrop, or short URL).
2. Drones: [Just Equal](https://fourms.github.io/omo/apps/just-equal/) or [Harmonizer](https://fourms.github.io/omo/apps/harmonizer/); assign roots (e.g. F / A♭ / C / E♭).
3. Rhythm: split [Drum Sequencer](https://fourms.github.io/omo/apps/drum-sequencer/), [Rhythm Machine](https://fourms.github.io/omo/apps/rhythm-machine/) (Draw, Euclid, or L-system), [Drumkit](https://fourms.github.io/omo/apps/drumkit/), or [Firefly](https://fourms.github.io/omo/apps/firefly/).
4. Melody: [Markov Melody](https://fourms.github.io/omo/apps/markov-melody/), [Kaoss Pad](https://fourms.github.io/omo/apps/kaoss-pad/) (Beat program for pulse layer), or [Mic Theremin](https://fourms.github.io/omo/apps/mic-theremin/).
5. Texture: [Granular Tilt](https://fourms.github.io/omo/apps/granular-tilt/), [Video Sonifier](https://fourms.github.io/omo/apps/video-sonifier/), or [Vocoder Choir](https://fourms.github.io/omo/apps/vocoder-choir/) (hold centre button, sing).

### Cool-down (5 min)

One phone on [Shepard Glide](https://fourms.github.io/omo/apps/shepard-glide/) or [Just Equal](https://fourms.github.io/omo/apps/just-equal/); others silent. Discuss what felt musical vs “tech demo.”

## Extended scenarios

| Duration | Focus | Apps | Notes |
|----------|--------|------|--------|
| 10 min | Pulse only | Conductor + Firefly | No melody; listen for entrainment |
| 15 min | Camera room | Shadow Sequencer + Video Sonifier | Dim lights; discuss privacy |
| 20 min | Synthesis tour | Synth Tour (FM → Ring → Wavetable → Supersaw) → Pluck Bowl | One pad, engines compared by ear |
| 25 min | Kaoss layer | Kaoss Pad Beat + drone row | Quantized pulse under free harmony |
| 30 min | ML ethics | Train Shake + Hum Clap | Compare k-NN on motion vs audio features |
| 30 min | Standstill session | Standstill + Micromotion | Inverse instruments; see Micromotion & Sonification |

## Suggested role map (49 apps)

| Role | Good starting apps |
|------|-------------------|
| Pulse / time | [Conductor](https://fourms.github.io/omo/apps/conductor/), [Firefly](https://fourms.github.io/omo/apps/firefly/), [Clap Architect](https://fourms.github.io/omo/apps/clap-architect/) |
| Grid rhythm | [Drumkit](https://fourms.github.io/omo/apps/drumkit/), [Drum Sequencer](https://fourms.github.io/omo/apps/drum-sequencer/), [Rhythm Machine](https://fourms.github.io/omo/apps/rhythm-machine/) |
| Drones / harmony | [Just Equal](https://fourms.github.io/omo/apps/just-equal/), [Harmonizer](https://fourms.github.io/omo/apps/harmonizer/), [Compass Wah (Choir)](https://fourms.github.io/omo/apps/compass-wah/?mode=choir), [Swarm Bloom](https://fourms.github.io/omo/apps/swarm-bloom/) |
| Motion expression | [Motion Filter](https://fourms.github.io/omo/apps/motion-filter/), [Sound Saber](https://fourms.github.io/omo/apps/sound-saber/), [Shepard Glide](https://fourms.github.io/omo/apps/shepard-glide/), [Pinch Bass](https://fourms.github.io/omo/apps/pinch-bass/) |
| Stillness / micromotion | [Standstill](https://fourms.github.io/omo/apps/standstill/), [Micromotion](https://fourms.github.io/omo/apps/micromotion/) |
| Melody / pitch | [Piano](https://fourms.github.io/omo/apps/piano/), [Kaoss Pad](https://fourms.github.io/omo/apps/kaoss-pad/), [Markov Melody](https://fourms.github.io/omo/apps/markov-melody/), [Flute Blow](https://fourms.github.io/omo/apps/flute-blow/), [Mic Theremin](https://fourms.github.io/omo/apps/mic-theremin/) |
| Timbre / FX | [Sampler](https://fourms.github.io/omo/apps/sampler/), [Scrub Tape](https://fourms.github.io/omo/apps/scrub-tape/), [Granular Tilt](https://fourms.github.io/omo/apps/granular-tilt/), [Synth Tour](https://fourms.github.io/omo/apps/synth-tour/), [Pluck Bowl](https://fourms.github.io/omo/apps/pluck-bowl/) |
| Camera / room | [Shadow Sequencer](https://fourms.github.io/omo/apps/shadow-sequencer/), [Video Sonifier](https://fourms.github.io/omo/apps/video-sonifier/), [Room Reverb Send](https://fourms.github.io/omo/apps/room-reverb-send/) |
| Mapping design | [Mapping Roulette](https://fourms.github.io/omo/apps/mapping-roulette/), [Motion Filter](https://fourms.github.io/omo/apps/motion-filter/), [Pinch Bass](https://fourms.github.io/omo/apps/pinch-bass/) |
| ML showcase | [Train Shake](https://fourms.github.io/omo/apps/train-shake/), [Hum Clap](https://fourms.github.io/omo/apps/hum-clap/), [Evo Drumkit](https://fourms.github.io/omo/apps/evo-drumkit/), [Gesture Regression](https://fourms.github.io/omo/apps/gesture-regression/) |

Full tables: [App catalog](App-Catalog).

## Accessibility

- Large touch targets; centre record buttons are ~5 cm on most phones.
- [Train & Shake](https://fourms.github.io/omo/apps/train-shake/) classes can be relabelled (e.g. phone low / mid / high).
- Sequencers and live readouts give visual feedback; Firefly flashes on pulse.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Mic/camera/motion blocked | Safari (iOS) or Chrome (Android); not an in-app browser |
| No sound | Audio on; tap play surface; check mute switch (iOS) |
| Shepard stops while held | Reload page (cache update); keep finger on pad, not edge |
| Motion flat | Reload; iOS Settings → Safari → Motion & Orientation |
| Out of sync | Conductor shared link; expect ~50–100 ms spread without a server |
| Harsh room | Lower volume; fewer distortion / shake players |

## Assessment prompts (school / university)

1. Map [FM Touch](https://fourms.github.io/omo/apps/fm-touch/) or [Motion Filter → Ladder](https://fourms.github.io/omo/apps/motion-filter/?mode=ladder) to oscillator → filter → output. Where is the sensor in the chain?
2. Why is k-NN ([Hum Clap](https://fourms.github.io/omo/apps/hum-clap/), [Train Shake](https://fourms.github.io/omo/apps/train-shake/)) a form of supervised learning?
3. Compare [Granular Tilt](https://fourms.github.io/omo/apps/granular-tilt/) (cloud texture) to [Pluck Bowl](https://fourms.github.io/omo/apps/pluck-bowl/) (resonant strikes): ambient vs rhythmic roles?
4. [Kaoss Pad](https://fourms.github.io/omo/apps/kaoss-pad/): how does quantizing pitch on X differ from free pitch on [Mic Theremin](https://fourms.github.io/omo/apps/mic-theremin/)?
5. [Sampler](https://fourms.github.io/omo/apps/sampler/) / [Scrub Tape](https://fourms.github.io/omo/apps/scrub-tape/): what is stored in the audio buffer, and what does scrubbing change?
