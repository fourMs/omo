# App catalog

Live links use the [GitHub Pages site](https://fourms.github.io/omo/) (same paths as the repo).

**49 apps** on the hub — source of truth: `shared/hub-catalog.js` (this file is generated from it by `scripts/generate-wiki.mjs`). Folder names under `apps/` are kebab-case; titles are Title Case.

The **Teaches** column names the main concept and the matching chapter of [Sensing Sound and Music](https://fourms.github.io/sensingsoundandmusic/).

| Section | Count |
|---------|------:|
| Rhythm | 9 |
| Drones & motion | 10 |
| Melody | 9 |
| Synthesis | 7 |
| Texture | 10 |
| AI & learning | 4 |

## Playing surfaces

| Pattern | Examples |
|---------|----------|
| Full pad / X–Y | Kaoss Pad, FM Touch, Pinch Bass, Synth Tour |
| Centre record button | Sampler, Scrub Tape, Wind Bottle, Vocoder Choir |
| Hold pad | Shepard Glide, Motion Filter, many drones |
| Hold still | Standstill, Micromotion (inverse: movement silences) |
| Keyboard / sequencer | Piano, Markov Melody, Rhythm Machine |

## Rhythm

| App | Synth / role | Sensors | Teaches |
|-----|--------------|---------|---------|
| [Clap Architect](https://fourms.github.io/omo/apps/clap-architect/) | Learned kit | Mic · touch | Onset detection · Machine listening |
| [CliX](https://fourms.github.io/omo/apps/clix/) | Typed impulse · grid velocity | Keyboard · touch | Ensemble timing and velocity grids · Time and rhythm |
| [Conductor](https://fourms.github.io/omo/apps/conductor/) | Ensemble click | Touch · shared URL | Pulse and tactus · Time and rhythm |
| [Delay Throw](https://fourms.github.io/omo/apps/delay-throw/) | Delay feedback | Touch · tilt | Delay, feedback, echo rhythm · Electroacoustics |
| [Drum Sequencer](https://fourms.github.io/omo/apps/drum-sequencer/) | Step sequencer | Touch | Metre, repetition, syncopation · Time and rhythm |
| [Drumkit](https://fourms.github.io/omo/apps/drumkit/) | Drum synthesis | Touch | Onsets, envelopes, drum timbre · Time and rhythm |
| [Firefly](https://fourms.github.io/omo/apps/firefly/) | Pulse click | Mic · touch | Entrainment, coupled oscillators · Time and rhythm |
| [Rhythm Machine](https://fourms.github.io/omo/apps/rhythm-machine/) | Ring seq · draw, Euclid, L-system | Touch | Euclidean and generative rhythm · Time and rhythm |
| [Shadow Sequencer](https://fourms.github.io/omo/apps/shadow-sequencer/) | 8-step mask | Camera · touch | Optical sensing as score · Vision |

## Drones & motion

| App | Synth / role | Sensors | Teaches |
|-----|--------------|---------|---------|
| [Compass Wah](https://fourms.github.io/omo/apps/compass-wah/) | Compass wah or choir | Touch · compass · tilt | Orientation as control · The body |
| [Green Button](https://fourms.github.io/omo/apps/green-button/) | Swarm tones | Touch · motion | Swell, vibrato, ensemble density · Electroacoustics |
| [Harmonizer](https://fourms.github.io/omo/apps/harmonizer/) | Chroma drones | Mic · touch | Chroma and room harmony · Machine listening |
| [Just Equal](https://fourms.github.io/omo/apps/just-equal/) | Detuned sines | Touch | Just vs equal temperament · Harmony and melody |
| [Micromotion](https://fourms.github.io/omo/apps/micromotion/) | Band-split stillness voices | Motion · gyro (optional) | Motion bands and sensor limits · The body |
| [Motion Filter](https://fourms.github.io/omo/apps/motion-filter/) | Tilt · shake · ladder · flat | Touch · motion · tilt | Action–sound mappings · The body |
| [Shepard Glide](https://fourms.github.io/omo/apps/shepard-glide/) | Shepard tone | Touch · tilt | Shepard illusion · Psychoacoustics |
| [Sound Saber](https://fourms.github.io/omo/apps/sound-saber/) | Pulse · delay · ring | Touch · motion | Motion as timbre · The body |
| [Standstill](https://fourms.github.io/omo/apps/standstill/) | Inverse stillness bloom | Motion · tilt | Micromotion and standstill · The body |
| [Swarm Bloom](https://fourms.github.io/omo/apps/swarm-bloom/) | Evo drones + rhythm | Mic · ensemble | Emergent ensemble roles · The body |

## Melody

| App | Synth / role | Sensors | Teaches |
|-----|--------------|---------|---------|
| [Bow Phone](https://fourms.github.io/omo/apps/bow-phone/) | Bowed string | Touch · camera | Continuous excitation · The body |
| [Bowed Waveguide](https://fourms.github.io/omo/apps/bowed-waveguide/) | Continuous KS | Touch drag | Physical modelling (bowed) · Electroacoustics |
| [Crystalis](https://fourms.github.io/omo/apps/crystalis/) | Bowed band · grid pluck | Keyboard · touch pad | Ensemble grid performance · Time and rhythm |
| [Flute Blow](https://fourms.github.io/omo/apps/flute-blow/) | Breath tone | Mic · touch | Excitation and resonance · Acoustics |
| [Kaoss Pad](https://fourms.github.io/omo/apps/kaoss-pad/) | XY loop synth | Touch pad | Scales and quantization · Harmony and melody |
| [Markov Melody](https://fourms.github.io/omo/apps/markov-melody/) | 2nd-order Markov | Touch · keyboard | Markov chains · Machine listening |
| [Mic Theremin](https://fourms.github.io/omo/apps/mic-theremin/) | Pitch-tracked sine | Mic · touch | Pitch tracking · Machine listening |
| [Piano](https://fourms.github.io/omo/apps/piano/) | Keyboard tones | Touch | Pitch reference, voice-leading · Harmony and melody |
| [Tilt Harp](https://fourms.github.io/omo/apps/tilt-harp/) | Plucked harp | Touch · tilt | Damping and decay · Acoustics |

## Synthesis

| App | Synth / role | Sensors | Teaches |
|-----|--------------|---------|---------|
| [Additive Bells](https://fourms.github.io/omo/apps/additive-bells/) | Additive partials | Touch · motion | Additive synthesis, Fourier · Acoustics |
| [FM Touch](https://fourms.github.io/omo/apps/fm-touch/) | 2-op FM · finger or tilt | Touch · tilt | FM synthesis · Electroacoustics |
| [KS String](https://fourms.github.io/omo/apps/ks-string/) | KS · pluck position | Touch · tilt | Physical modelling (Karplus–Strong) · Electroacoustics |
| [Mapping Roulette](https://fourms.github.io/omo/apps/mapping-roulette/) | Remappable saw voice | Touch · drag speed | Coupling vs mapping · The body |
| [Pinch Bass](https://fourms.github.io/omo/apps/pinch-bass/) | Subtractive bass | Pinch · XY | Cross-coupled mapping · The body |
| [Pluck Bowl](https://fourms.github.io/omo/apps/pluck-bowl/) | KS + LFO layers | Touch position | Inharmonic partials, strike position · Acoustics |
| [Synth Tour](https://fourms.github.io/omo/apps/synth-tour/) | FM · ring · AM · PD · wavetable · supersaw | Touch · mic · gyro | Synthesis techniques compared · Electroacoustics |

## Texture

| App | Synth / role | Sensors | Teaches |
|-----|--------------|---------|---------|
| [Chaos Attractor](https://fourms.github.io/omo/apps/chaos-attractor/) | Chaotic subtractive | Touch · motion | Sensitivity to initial conditions · Electroacoustics |
| [Granular Tilt](https://fourms.github.io/omo/apps/granular-tilt/) | Granular cloud | Touch · tilt · mic | Granular synthesis · Electroacoustics |
| [Room Reverb Send](https://fourms.github.io/omo/apps/room-reverb-send/) | Convolver wet | Mic · touch | Reverberation and feedback · Acoustics |
| [Sampler](https://fourms.github.io/omo/apps/sampler/) | Sample playback | Mic · touch · tilt | Sampling · Electroacoustics |
| [Scrub Tape](https://fourms.github.io/omo/apps/scrub-tape/) | Buffer scrub | Mic · tape ribbon | Tape speed: time–pitch coupling · Electroacoustics |
| [Spectral Freeze](https://fourms.github.io/omo/apps/spectral-freeze/) | FFT partials · freeze or soup | Mic · touch | Spectrum, FFT, averaging · Acoustics |
| [Tap Bloom](https://fourms.github.io/omo/apps/tap-bloom/) | Generative blooms | Touch | Generative layering and reverb · Electroacoustics |
| [Video Sonifier](https://fourms.github.io/omo/apps/video-sonifier/) | Camera → sound | Camera | Sonification of visual motion · Vision |
| [Vocoder Choir](https://fourms.github.io/omo/apps/vocoder-choir/) | Band vocoder | Mic · tilt · touch | Source–filter model, formants · Acoustics |
| [Wind Bottle](https://fourms.github.io/omo/apps/wind-bottle/) | Noise resonator | Tilt · touch | Noise and resonance · Acoustics |

## AI & learning

| App | Synth / role | Sensors | Teaches |
|-----|--------------|---------|---------|
| [Evo Drumkit](https://fourms.github.io/omo/apps/evo-drumkit/) | Evolving drums | Touch · mic | Evolutionary algorithms · Machine listening |
| [Gesture Regression](https://fourms.github.io/omo/apps/gesture-regression/) | ML → filter | Motion · touch | Nearest-neighbour regression · Machine listening |
| [Hum Clap](https://fourms.github.io/omo/apps/hum-clap/) | k-NN classifier | Mic | Audio classification · Machine listening |
| [Train Shake](https://fourms.github.io/omo/apps/train-shake/) | ML gesture map | Motion | Rule-based vs learned models · Machine listening |

## Consolidated instruments (legacy URLs redirect)

Several earlier apps became **modes** of a canonical instrument. Old links and QR codes keep working:

| Old app | Now |
|---------|-----|
| `audience` | [`green-button/`](https://fourms.github.io/omo/apps/green-button/) |
| `circular-drum` | [`rhythm-machine/?gen=draw`](https://fourms.github.io/omo/apps/rhythm-machine/?gen=draw) |
| `color-band` | [`video-sonifier/`](https://fourms.github.io/omo/apps/video-sonifier/) |
| `drone-choir` | [`just-equal/`](https://fourms.github.io/omo/apps/just-equal/) |
| `edge-strum` | [`ks-string/`](https://fourms.github.io/omo/apps/ks-string/) |
| `euclidean-rings` | [`rhythm-machine/?gen=euclid`](https://fourms.github.io/omo/apps/rhythm-machine/?gen=euclid) |
| `filter-ladder` | [`motion-filter/?mode=ladder`](https://fourms.github.io/omo/apps/motion-filter/?mode=ladder) |
| `flat-edge` | [`motion-filter/?mode=flat`](https://fourms.github.io/omo/apps/motion-filter/?mode=flat) |
| `fm-matrix` | [`synth-tour/?engine=fm`](https://fourms.github.io/omo/apps/synth-tour/?engine=fm) |
| `fm-touch-tilt` | [`fm-touch/?mod=tilt`](https://fourms.github.io/omo/apps/fm-touch/?mod=tilt) |
| `gyro-whirl` | [`synth-tour/?engine=supersaw&timbre=spin`](https://fourms.github.io/omo/apps/synth-tour/?engine=supersaw&amp;timbre=spin) |
| `heading-choir` | [`compass-wah/?mode=choir`](https://fourms.github.io/omo/apps/compass-wah/?mode=choir) |
| `hold-loop-tilt` | [`sampler/`](https://fourms.github.io/omo/apps/sampler/) |
| `ks-pluck` | [`ks-string/`](https://fourms.github.io/omo/apps/ks-string/) |
| `lsystem-groove` | [`rhythm-machine/?gen=lsystem`](https://fourms.github.io/omo/apps/rhythm-machine/?gen=lsystem) |
| `motion-grid` | [`video-sonifier/`](https://fourms.github.io/omo/apps/video-sonifier/) |
| `motion-wah` | [`motion-filter/?mode=tilt`](https://fourms.github.io/omo/apps/motion-filter/?mode=tilt) |
| `am-radio` | [`synth-tour/?engine=am`](https://fourms.github.io/omo/apps/synth-tour/?engine=am) |
| `phase-distortion` | [`synth-tour/?engine=pd`](https://fourms.github.io/omo/apps/synth-tour/?engine=pd) |
| `ring-mod-gong` | [`synth-tour/?engine=ring`](https://fourms.github.io/omo/apps/synth-tour/?engine=ring) |
| `shake-filter` | [`motion-filter/?mode=shake`](https://fourms.github.io/omo/apps/motion-filter/?mode=shake) |
| `spectral-soup` | [`spectral-freeze/?mode=soup`](https://fourms.github.io/omo/apps/spectral-freeze/?mode=soup) |
| `supersaw-stack` | [`synth-tour/?engine=supersaw`](https://fourms.github.io/omo/apps/synth-tour/?engine=supersaw) |
| `wavetable-scan` | [`synth-tour/?engine=wavetable`](https://fourms.github.io/omo/apps/synth-tour/?engine=wavetable) |

## Retired from hub

Removed or stubbed experiments include One Shot Orchestra, Part, Pitch Hive, Pocket Metronome, Synth Pad, Tilt Doppler, Torch Pulse, Whisper Gate, Light Theremin, Grain Rain, Haptic Click, Battery Drone, Geo Drone, Pressure Pad, PWM Bass, Hard Sync Lead, IR Cathedral, Live Loop Slicer. See [Ideas](https://github.com/fourMs/omo/blob/main/docs/IDEAS.md) in the repo.
