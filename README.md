# Oslo Mobile Orchestra

A collection of patches used with [Oslo Mobile Orchestra (OMO)](https://www.uio.no/ritmo/english/research/labs/fourms/research/projects/omo/) at the Department of Musicology, University of Oslo.

![OMO performance](docs/2012-omo_performance.jpg)

OMO used to work with a collection of patches developed in PureData and deployed via MobMuPlat. This collection uses browser-based apps that rely on the Web Audio API. They should work on both iOS and Android phones, although there may be variations in sensors available and browser capabilities.

**Play now:** [fourms.github.io/omo/](https://fourms.github.io/omo/)

## Browsers

The apps should (in theory) work in all modern browsers, but we have found they generally work best with **Safari on iPhone/iPad** and **Chrome on Android**. Open the site in the browser — not inside Instagram, email, or other in-app browsers (use “Open in browser” if needed).

## Quick start

1. Open the hub and pick an instrument — each card lists **synthesis** and **sensors** (49 apps in six sections).
2. Turn **Audio on** (top right) if sound does not start on first touch.
3. Tap **Learn** for how to play; **QR** shares a link to the same app for the group.
4. Allow **microphone**, **motion**, or **camera** when prompted (browser and OS settings).
5. Use the **Volume** bar under the header (**50%–150%**, default 100%) to match loud/quiet phones; also raise system volume and disable silent mode on iPhone.
6. **Add to Home Screen** for a more full-screen, offline-friendly install.

### Playing surfaces

Many apps use a similar layout:

| Pattern | Examples | How to play |
|---------|----------|-------------|
| **Full pad / X–Y** | Kaoss Pad, FM Touch, Pinch Bass | Drag on the large pad |
| **Centre record button** | Sampler, Scrub Tape, Wind Bottle, Vocoder Choir | Hold the round button (mic apps record; release to loop or stop) |
| **Hold pad** | Shepard Glide, Motion Filter, many drones | Keep finger down; tilt shapes sound |
| **Hold still** | Standstill, Micromotion | Stand still — sound appears; movement silences it |
| **Keyboard / sequencer** | Piano, Markov Melody, Rhythm Machine | Tap keys or steps |

Live readouts (filter Hz, position, training stats) stay visible at the top of the play area where relevant.

## Instruments

Compact list — full tables with folder names: **[docs/CATALOG.md](docs/CATALOG.md)**.

| | |
|---|---|
| **Rhythm** (9) | [Clap Architect](apps/clap-architect/) · [CliX](apps/clix/) · [Conductor](apps/conductor/) · [Delay Throw](apps/delay-throw/) · [Drum Sequencer](apps/drum-sequencer/) · [Drumkit](apps/drumkit/) · [Firefly](apps/firefly/) · [Rhythm Machine](apps/rhythm-machine/) · [Shadow Sequencer](apps/shadow-sequencer/) |
| **Drones** (10) | [Compass Wah](apps/compass-wah/) · [Green Button](apps/green-button/) · [Harmonizer](apps/harmonizer/) · [Just Equal](apps/just-equal/) · [Micromotion](apps/micromotion/) · [Motion Filter](apps/motion-filter/) · [Shepard Glide](apps/shepard-glide/) · [Sound Saber](apps/sound-saber/) · [Standstill](apps/standstill/) · [Swarm Bloom](apps/swarm-bloom/) |
| **Melody** (9) | [Bow Phone](apps/bow-phone/) · [Bowed Waveguide](apps/bowed-waveguide/) · [Crystalis](apps/crystalis/) · [Flute Blow](apps/flute-blow/) · [Kaoss Pad](apps/kaoss-pad/) · [Markov Melody](apps/markov-melody/) · [Mic Theremin](apps/mic-theremin/) · [Piano](apps/piano/) · [Tilt Harp](apps/tilt-harp/) |
| **Synthesis** (7) | [Additive Bells](apps/additive-bells/) · [FM Touch](apps/fm-touch/) · [KS String](apps/ks-string/) · [Mapping Roulette](apps/mapping-roulette/) · [Pinch Bass](apps/pinch-bass/) · [Pluck Bowl](apps/pluck-bowl/) · [Synth Tour](apps/synth-tour/) |
| **Texture** (10) | [Chaos Attractor](apps/chaos-attractor/) · [Granular Tilt](apps/granular-tilt/) · [Room Reverb Send](apps/room-reverb-send/) · [Sampler](apps/sampler/) · [Scrub Tape](apps/scrub-tape/) · [Spectral Freeze](apps/spectral-freeze/) · [Tap Bloom](apps/tap-bloom/) · [Video Sonifier](apps/video-sonifier/) · [Vocoder Choir](apps/vocoder-choir/) · [Wind Bottle](apps/wind-bottle/) |
| **AI** (4) | [Evo Drumkit](apps/evo-drumkit/) · [Gesture Regression](apps/gesture-regression/) · [Hum Clap](apps/hum-clap/) · [Train Shake](apps/train-shake/) |

## Documentation

| Resource | Contents |
|----------|----------|
| [App catalog](docs/CATALOG.md) | All hub apps by section (synthesis · sensors · folder slug) |
| [Workshop guide](docs/WORKSHOP-GUIDE.md) | 45-minute facilitator script |
| [Ideas](docs/IDEAS.md) | Backlog and shipped history |
| [Device support](support.html) | Sensor API checklist before workshops |
| [Wiki](https://github.com/fourMs/omo/wiki) | Extended workshop material ([`docs/wiki/`](docs/wiki/)) |

## License

[GPL-3.0](LICENSE)
