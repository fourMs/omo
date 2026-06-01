# Oslo Mobile Orchestra

A collection of patches used with [Oslo Mobile Orchestra (OMO)](https://www.uio.no/ritmo/english/research/labs/fourms/research/projects/omo/) at the Department of Musicology, University of Oslo.

![OMO performance](docs/2012-omo_performance.jpg)

OMO used to work with a collection of patches developed in PureData and deployed via MobMuPlat. This collection uses browser-based apps that rely on the Web Audio API. They should work on both iOS and Android phones, although there may be variations in sensors available and browser capabilities. 

**Play now:** [fourms.github.io/omo/](https://fourms.github.io/omo/)

## Browsers

The apps should (in theory) work in all modern browsers, but we have found they generally work best with Safari on iPhone and Chrome on Android.


## Quick start

1. Open the site in a browser (not inside a communication app or email; then you should use the "Open in browser" command).
2. Choose the app to play — each card lists **synthesis** and **sensors**. Display names match **folder names** (Title Case under `apps/`). Several apps combine former variants behind a **mode** menu (old URLs still redirect).
3. Apps will ask for different permissions, including the microphone, motion, or camera. Permissions may need to be given both within the browser and in the OS.
4. Turn up the volume to at least 70%. Turn off silent mode on iPhone.
5. In every app: **Learn** = how to play · **QR** = share this instrument with others· **Audio on** = activate sound if it doesn't start automatically.
6. Select "Add to Home Screen" for a more native-like experience.

## Instruments

| | |
|---|---|
| **Rhythm** | [Conductor](apps/conductor/) · [Drumkit](apps/drumkit/) · [Drum Sequencer](apps/drum-sequencer/) · [Circular Drum](apps/circular-drum/) · [Firefly](apps/firefly/) · [Delay Throw](apps/delay-throw/) · [Euclidean Rings](apps/euclidean-rings/) · [L-System Groove](apps/lsystem-groove/) · [Pocket Metronome](apps/pocket-metronome/) · [Clap Architect](apps/clap-architect/) · [Shadow Sequencer](apps/shadow-sequencer/) · [Torch Pulse](apps/torch-pulse/) |
| **Drones** | [Green Button](apps/green-button/) · [Just Equal](apps/just-equal/) · [Sound Saber](apps/sound-saber/) · [Motion Trump](apps/motion-wah/) · [Compass Wah](apps/compass-wah/) · [Harmonizer](apps/harmonizer/) · [Shepard Glide](apps/shepard-glide/) · [Shake Filter](apps/shake-filter/) · [Flat Edge](apps/flat-edge/) · [Heading Choir](apps/heading-choir/) · [Swarm Bloom](apps/swarm-bloom/) |
| **Melody** | [Piano](apps/piano/) · [Synth Pad](apps/synth-pad/) · [Mic Theremin](apps/mic-theremin/) · [Flute Blow](apps/flute-blow/) · [Tilt Harp](apps/tilt-harp/) · [Bow Phone](apps/bow-phone/) · [Markov Melody](apps/markov-melody/) · [Tilt Doppler](apps/tilt-doppler/) · [Bowed Waveguide](apps/bowed-waveguide/) |
| **Synthesis** | [FM Touch](apps/fm-touch/) · [FM Matrix](apps/fm-matrix/) · [KS String](apps/ks-string/) · [Additive Bells](apps/additive-bells/) · [Filter Ladder](apps/filter-ladder/) · [Ring Mod Gong](apps/ring-mod-gong/) · [Pinch Bass](apps/pinch-bass/) · [Edge Strum](apps/edge-strum/) · [Am Radio](apps/am-radio/) · [Phase Distortion](apps/phase-distortion/) · [Supersaw Stack](apps/supersaw-stack/) · [Pluck Bowl](apps/pluck-bowl/) |
| **Texture** | [Sampler](apps/sampler/) · [Granular Tilt](apps/granular-tilt/) · [Spectral Freeze](apps/spectral-freeze/) · [Tap Bloom](apps/tap-bloom/) · [Wavetable Scan](apps/wavetable-scan/) · [Video Sonifier](apps/video-sonifier/) · [Chaos Attractor](apps/chaos-attractor/) · [Room Reverb Send](apps/room-reverb-send/) · [Whisper Gate](apps/whisper-gate/) · [Wind Bottle](apps/wind-bottle/) · [Scrub Tape](apps/scrub-tape/) · [Vocoder Choir](apps/vocoder-choir/) |
| **AI** | [Evo Drumkit](apps/evo-drumkit/) · [Hum Clap](apps/hum-clap/) · [Train Shake](apps/train-shake/) · [Gesture Regression](apps/gesture-regression/) |

## Documentation

| Resource | Contents |
|----------|----------|
| **[Wiki](https://github.com/alexarje/Oslo-Mobile-Orchestra/wiki)** | Full app catalog, workshop scripts, browsers & sensors, ensemble sync, architecture |
| [Workshop guide](docs/WORKSHOP-GUIDE.md) | 45-minute facilitator script (in-repo copy) |
| [Ideas](docs/IDEAS.md) | Backlog (most instrument rows now shipped) |
| [Device support](support.html) | Sensor API checklist before workshops |

## License

[GPL-3.0](LICENSE)
