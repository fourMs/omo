# Ideas — Oslo Mobile Orchestra

Backlog of apps, features, and workshop concepts. Same stack as today: vanilla JS, Web Audio, static GitHub Pages, phones only.

---

## New instruments — mobile sensing

Phones expose more than mic + tilt. Each row is a candidate **app** (or major upgrade) pairing a sensor with a clear musical gesture.

### Motion & orientation

| Idea | Sensor / API | Music role | Synthesis hook |
|------|----------------|------------|----------------|
| ~~**Gyro Whirl**~~ | `rotationRate` (αβγ) | Spin phone → vibrato speed & stereo wobble | [Spin Chorus](../apps/gyro-whirl/) |
| ~~**Gravity Bounce**~~ | `accelerationIncludingGravity` | “Drop” phone feel → impact triggers | [Drop Bell](../apps/gravity-bounce/) |
| ~~**Shake Filter**~~ | High-pass jerk on accel | Sudden shakes open a filter | [Jerk Wah](../apps/shake-filter/) |
| ~~**Pocket Metronome**~~ | Step-like peaks in linear accel | Walk / tap pocket → sidechain duck | [Pocket Pulse](../apps/pocket-metronome/) |
| ~~**Flat / Edge**~~ | `beta` / `gamma` thresholds | Only sound when held flat vs upright | [Table Drone](../apps/flat-edge/) |
| ~~**Compass Choir**~~ | `webkitCompassHeading` / `alpha` | Section pans by where you face in room | [Heading Choir](../apps/heading-choir/) |
| ~~**Tilt Doppler**~~ | Rapid β change | Tilt speed → pitch sweep (Doppler-ish) | [Doppler Tilt](../apps/tilt-doppler/) |

### Microphone & audio input

| Idea | Sensor / API | Music role | Synthesis hook |
|------|----------------|------------|----------------|
| ~~**Room Reverb Send**~~ | Mic RMS + optional loopback | Loudness in room → wet/dry | [Room Wash](../apps/room-reverb-send/) |
| ~~**Whisper Gate**~~ | Mic + noise floor tracking | Only soft sounds pass | [Soft Vowel](../apps/whisper-gate/) |
| ~~**Clap Architect**~~ | Onset times from mic | Clap spacing builds a rhythm grid | [Clap Grid](../apps/clap-architect/) |
| ~~**Pitch Hive**~~ | Multi-pitch peaks (FFT) | Humming group → chord root | [Hum Hive](../apps/pitch-hive/) |
| ~~**Feedback Flute**~~ | Mic + speaker (careful) | Controlled feedback whistle | [Whistle Loop](../apps/feedback-flute/) |

### Camera & light

| Idea | Sensor / API | Music role | Synthesis hook |
|------|----------------|------------|----------------|
| ~~**Light Theremin**~~ | `AmbientLightSensor` | Cover sensor → darker tone | [light-theremin](../apps/light-theremin/) |
| ~~**Shadow Sequencer**~~ | Front camera brightness map | Hand shadow → 8-step mask | [Shadow Steps](../apps/shadow-sequencer/) |
| ~~**Color Band**~~ | Camera dominant hue | Point at coloured objects → scale | [Hue Scale](../apps/color-band/) |
| ~~**Motion Grid**~~ | Camera frame diff (like Video Sonifier) | Movement amount → rhythm density | [Grain Cam](../apps/motion-grid/) |
| ~~**Torch Pulse**~~ | `torch` / screen flash + rear cam | Flash on beat for ensemble visual | [Flash Beat](../apps/torch-pulse/) |

### Touch & device

| Idea | Sensor / API | Music role | Synthesis hook |
|------|----------------|------------|----------------|
| ~~**Pinch Bass**~~ | Two-finger pinch scale | Pinch → filter + sub level | [Pinch Sub](../apps/pinch-bass/) |
| ~~**Pressure Pad**~~ | `force` on `PointerEvent` (iOS) | Hard press → louder + brighter | [Force Bright](../apps/pressure-pad/) |
| ~~**Edge Strum**~~ | Pointer down at pad edge vs centre | Edge = harmonics, centre = fundamental | [Rim Pluck](../apps/edge-strum/) |
| ~~**Haptic Click**~~ | `navigator.vibrate` patterns | Android: feel the rhythm you programmed | [Vibe Lane](../apps/haptic-click/) |
| ~~**Battery Drone**~~ | `navigator.getBattery()` | Low battery → thinner, detuned ensemble | [Power Thin](../apps/battery-drone/) |

### Location & environment (experimental / fragile APIs)

| Idea | Sensor / API | Music role | Synthesis hook |
|------|----------------|------------|----------------|
| ~~**Geo Drone**~~ | `geolocation` speed / heading | Walk around space → slow panorama | [Walk Pan](../apps/geo-drone/) |

### Already explored (reference)

| Shipped / partial | Sensing |
|-----------------|---------|
| [Motion Wah](../apps/motion-wah/), [Compass Wah](../apps/compass-wah/) | Tilt, heading |
| [Firefly](../apps/firefly/), [Harmonizer](../apps/harmonizer/), [Swarm Bloom](../apps/swarm-bloom/) | Mic onsets, chroma, evo soundscape |
| [Train & Shake](../apps/train-shake/), [Hum vs Clap](../apps/hum-clap/) | Accel features → ML |
| [Bow Phone](../apps/bow-phone/) | Camera + hand motion |
| [Video Sonifier](../apps/video-sonifier/) | Camera motion → pitch |
| [Additive Bells](../apps/additive-bells/) | Downward accel hit |
| [Granular Tilt](../apps/granular-tilt/), [Delay Throw](../apps/delay-throw/) | Tilt |

---

## New instruments — synthesis

Different ways to generate sound beyond what the hub already demos. Pair with touch or a sensor for performance.

### Oscillator & modulation

| Idea | Approach | Music role | Control idea |
|------|----------|------------|--------------|
| ~~**Hard Sync Lead**~~ | Oscillator hard sync | Aggressive lead | [Sync Scream](../apps/hard-sync-lead/) |
| ~~**Ring Mod Gong**~~ | Ring mod (two sines) | Metallic inharmonic | [ring-mod-gong](../apps/ring-mod-gong/) |
| ~~**AM Radio**~~ | Amplitude modulation | Old-radio sidebands | [AM Dial](../apps/am-radio/) |
| ~~**Phase Distortion**~~ | Casio-style PD curve | Digital 80s lead | [PD Lead](../apps/phase-distortion/) |
| ~~**SuperSaw Stack**~~ | Detuned saw cluster | Ensemble pad | [Blade Chorus](../apps/supersaw-stack/) |
| ~~**Pulse Width Bass**~~ | Variable rectangle | Nasty bass | [Pulse Bass](../apps/pwm-bass/) |

### Physical & waveguide

| Idea | Approach | Music role | Control idea |
|------|----------|------------|--------------|
| ~~**Dual KS Harp**~~ | Two coupled delay lines | Hammered dulcimer | [Twin Wire](../apps/dual-ks-harp/) |
| ~~**Bowed Waveguide**~~ | Continuous excitation + loop | Cello-like (simpler than Bow Phone) | [Drag Bow](../apps/bowed-waveguide/) |
| ~~**Pluck Bowl**~~ | 2D wave mesh (lite) | Splashy percussion | [Bowl Splash](../apps/pluck-bowl/) |
| ~~**Wind Bottle**~~ | Noise + resonant peak + feedback | Breath without mic | [Bottle Breath](../apps/wind-bottle/) |

### Granular & spectral

| Idea | Approach | Music role | Control idea |
|------|----------|------------|--------------|
| ~~**Spectral Freeze**~~ | Hold current FFT frame | Cloud pad | [spectral-freeze](../apps/spectral-freeze/) |
| ~~**Grain Rain**~~ | Random grain positions | Texture | [Shake Dust](../apps/grain-rain/) |
| ~~**Scrub Tape**~~ | Play buffer forward/back | DJ scrub | [Tape Scrub](../apps/scrub-tape/) |
| ~~**Vocoder Choir**~~ | Mic → band vocoder | Robot choir | [Robot Hall](../apps/vocoder-choir/) |

### Sampling & convolution

| Idea | Approach | Music role | Control idea |
|------|----------|------------|--------------|
| ~~**IR Cathedral**~~ | Convolve tone with uploaded IR | Space without reverb unit | [Space Convolve](../apps/ir-cathedral/) |
| ~~**One-Shot Orchestra**~~ | Multi-sample map on pad zones | Instant ensemble hits | [Zone Hits](../apps/one-shot-orchestra/) |
| ~~**Live Loop Slicer**~~ | Record bar; jump slices | Breakbeat | [Slice Bar](../apps/live-loop-slicer/) |

### Algorithmic & generative

| Idea | Approach | Music role | Control idea |
|------|----------|------------|--------------|
| ~~**Markov Melody**~~ | Learn 2nd-order from taps | [Chain Melody](../apps/markov-melody/) | Touch · keyboard |
| ~~**Euclidean Rings**~~ | Euclidean rhythms on circles | [Euclidean Pulse](../apps/euclidean-rings/) | Touch |
| ~~**L-System Groove**~~ | Rewrite rules → drum map | [Fractal Lane](../apps/lsystem-groove/) | Touch |
| ~~**Chaos Attractor**~~ | Lorenz / logistic → params | [Strange Attractor](../apps/chaos-attractor/) | Touch · motion |

### Lo-fi & hybrid

| Idea | Approach | Music role | Control idea |
|------|----------|------------|--------------|
| ~~**Feedback Matrix**~~ | Small feedback delay network | [Delay Maze](../apps/feedback-matrix/) | Touch · gyro |
| ~~**Shepard Glide**~~ | Continuous Shepard tone | [Endless Rise](../apps/shepard-glide/) | Touch · tilt |

### Already on hub (reference)

| App | Synthesis |
|-----|-----------|
| [Synth Pad](../apps/synth-pad/) | Subtractive |
| [FM Touch](../apps/fm-touch/), [+ Tilt](../apps/fm-touch-tilt/), [Matrix](../apps/fm-matrix/) | FM |
| [KS String](../apps/ks-string/), [Pluck](../apps/ks-pluck/) | Karplus–Strong |
| [Additive Bells](../apps/additive-bells/) | Additive |
| [Wavetable Scan](../apps/wavetable-scan/) | Wavetable |
| [Filter Ladder](../apps/filter-ladder/) | Ladder LP |
| [Sampler](../apps/sampler/), [Granular Tilt](../apps/granular-tilt/) | Sample / granular |
| [Drumkit](../apps/drumkit/), sequencers | Drum models |
| [Evo Drumkit](../apps/evo-drumkit/) | GA pattern match |

---

## Sensor × synthesis matrix (workshop prompts)

Use when designing a new app: pick **one primary sensor** and **one synthesis family** not yet paired on the hub.

|  | Subtractive | FM | KS / waveguide | Granular | Additive | Sample |
|--|-------------|-----|----------------|----------|----------|--------|
| **Gyro only** | open | ~~Gyro Whirl~~ | open | ~~Grain Rain~~ | open | open |
| **Ambient light** | ~~Light Theremin~~ | open | open | open | open | open |
| **Magnetometer** | open | open | open | open | ~~Compass Choir~~ | open |
| **Barometer** | open | open | ~~Wind Bottle~~ | open | open | open |
| **Pinch / force** | open | open | ~~Edge Strum~~ | open | open | open |
| **Camera hue** | open | open | open | ~~Motion Grid~~ | ~~Color Band~~ | open |
| **Vocoder** | — | — | — | — | — | ~~Vocoder Choir~~ |

---

## New instruments (apps) — quick list (legacy table)

| Idea | Music role | Tech |
|------|------------|------|
| ~~**Pentatonic Flute**~~ | Melody by breath | [flute-blow](../apps/flute-blow/) |
| ~~**Mic Theremin**~~ | Solo melody | [mic-theremin](../apps/mic-theremin/) |
| ~~**Hum vs Clap**~~ | Call-and-response | [hum-clap](../apps/hum-clap/) |
| ~~**Tilt Harp**~~ | Plucked glissandi | [tilt-harp](../apps/tilt-harp/) |
| ~~**Delay Throw**~~ | Rhythmic layers | [delay-throw](../apps/delay-throw/) |
| ~~**Bow Phone**~~ | Bowed strings | [bow-phone](../apps/bow-phone/) |
| ~~**Your Part (QR)**~~ | Seating | [part](../apps/part/) |
| ~~**Video Sonifier**~~ | Environment texture | [video-sonifier](../apps/video-sonifier/) |
| ~~**Audience swell**~~ | Crowd layer | [audience](../apps/audience/) |
| ~~**Compass Wah**~~ | Orientation filter | [compass-wah](../apps/compass-wah/) |
| ~~**Firefly**~~ | Pulse sync | [firefly](../apps/firefly/) |
| ~~**Harmonizer**~~ | Group tonality | [harmonizer](../apps/harmonizer/) |
| ~~**Evo Drumkit**~~ | Evolved grooves | [evo-drumkit](../apps/evo-drumkit/) |
| ~~**Circular drums**~~ | Ring sequencer | [circular-drum](../apps/circular-drum/) |

---

## Enhance existing apps

- ~~**Drone Choir**~~ — hold-to-sustain; cents ruler on pad
- ~~**Motion Wah**~~ — continuous mode toggle
- ~~**Train & Shake**~~ — sway + export/import
- ~~**Conductor**~~ — QR + visual metronome flash
- ~~**Synth Pad**~~ — aftertouch
- ~~**Granular Tilt**~~ — hold freeze buffer; upload sample
- ~~**Harmonizer**~~ — auto major/minor; scale lock + lock root
- ~~**Firefly**~~ — full-screen visual flash (stronger on downbeats)
- ~~**KS String / Pluck**~~ — optional reverb send per pluck

---

## Ensemble & sync

| Idea | Why | Status |
|------|-----|--------|
| **WebRTC room** | Tighter beat than URL `start` time | Not started (needs server) |
| **WebSocket hub** | Global grid step broadcast | Not started |
| **Listen & lock** | Mic phase correction | Partial (Firefly, Harmonizer) |
| ~~**Section colors**~~ | `?section=` on hub | Shipped |
| **Room reverb send** | Laptop reverb bus | Not started (multi-device bus) |
| **Bluetooth clock** | Wired sync for pro workshops | Research |

---

## AI & education (showcase)

- ~~Teachable panel, confusion matrix, k slider, ethics, k-NN vs tiny net~~ — [Train & Shake](../apps/train-shake/)
- ~~Hum vs clap classifier~~ — [hum-clap](../apps/hum-clap/)
- ~~Genetic drum patterns~~ — [Evo Drumkit](../apps/evo-drumkit/)
- ~~Gesture → synthesis params~~ — [Tilt Learn](../apps/gesture-regression/) (k-NN tilt → filter)
- **On-device style transfer** — “play like shake” swaps FM ratios (advanced)

---

## Sensors — API cheat sheet

| Sensor | Web API | iOS Safari | Android Chrome | Notes |
|--------|---------|------------|----------------|-------|
| Acceleration | `devicemotion` / `Accelerometer` | Permission | Often OK | Linear vs gravity split |
| Rotation rate | `rotationRate` | Permission | Often OK | Good for vibrato |
| Orientation | `deviceorientation` | Permission | Mixed | Compass heading iOS |
| Mic | `getUserMedia` | Prompt | Prompt | Core to many apps |
| Camera | `getUserMedia` | Prompt | Prompt | Light cost |
| Ambient light | `AmbientLightSensor` | Limited | Often yes | Fallback: manual slider |
| Magnetometer | `Magnetometer` / compass | Partial | Partial | Prefer `webkitCompassHeading` |
| Barometer | `PressureSensor` | Rare | Rare | Graceful degrade |
| Geolocation | `geolocation` | Prompt | Prompt | Outdoor workshops |
| Battery | `getBattery()` | Deprecated | Varies | Subtle only |
| Vibration | `vibrate()` | No | Yes | Output, not input |
| Force touch | `force` on pointer | Some iOS | Rare | Synth Pad–style |

---

## Workshop & concert

- **20-part score card** — PDF one-pager (open)
- ~~**5-minute open ritual**~~ — Conductor `?start=` + countdown
- **Silent movement piece** — Train & Shake visual-only (facilitator)
- ~~**Audience phones**~~ — [audience](../apps/audience/)
- ~~**Accessibility mode**~~ — hub “Larger UI” + `omo-a11y` CSS
- **Sensor safari** — 15 min: rotate stations (light, gyro, mic, camera)
- **Synthesis tour v2** — pair each stop with one sensor constraint

---

## Infrastructure

- ~~**PWA manifest**~~ — `manifest.webmanifest`
- ~~**Offline cache**~~ — `sw.js` (core assets)
- ~~**Header QR share**~~ — all apps
- **i18n** — Norwegian + English
- **Telemetry opt-in** — anonymous app usage
- **Version pin** — `?v=2` for workshops
- ~~**Feature detect page**~~ — [support.html](../support.html) lists sensor APIs per device

---

## Priority (suggested)

1. ~~**Light Theremin**~~ · ~~**Gyro Whirl**~~ — shipped  
2. ~~**Ring Mod Gong**~~ · ~~**Hard Sync Lead**~~ — shipped  
3. ~~**Spectral Freeze**~~ — shipped  
4. **WebRTC room** — when acoustic sync isn’t enough  
5. ~~**Feature detect page**~~ — [support.html](../support.html)

Contributions welcome: pick an open item, open a PR, link it here and in the [wiki](https://github.com/alexarje/Oslo-Mobile-Orchestra/wiki).
