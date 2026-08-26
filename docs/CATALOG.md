# App catalog

Complete list of instruments on the [hub](https://fourms.github.io/omo/).

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

| App | Folder | Synth / role | Sensors | Teaches |
|-----|--------|--------------|---------|---------|
| [Clap Architect](../apps/clap-architect/) | `clap-architect` | Learned kit | Mic · touch | Onset detection · Machine listening |
| [CliX](../apps/clix/) | `clix` | Typed impulse · grid velocity | Keyboard · touch | Ensemble timing and velocity grids · Time and rhythm |
| [Conductor](../apps/conductor/) | `conductor` | Ensemble click | Touch · shared URL | Pulse and tactus · Time and rhythm |
| [Delay Throw](../apps/delay-throw/) | `delay-throw` | Delay feedback | Touch · tilt | Delay, feedback, echo rhythm · Electroacoustics |
| [Drum Sequencer](../apps/drum-sequencer/) | `drum-sequencer` | Step sequencer | Touch | Metre, repetition, syncopation · Time and rhythm |
| [Drumkit](../apps/drumkit/) | `drumkit` | Drum synthesis | Touch | Onsets, envelopes, drum timbre · Time and rhythm |
| [Firefly](../apps/firefly/) | `firefly` | Pulse click | Mic · touch | Entrainment, coupled oscillators · Time and rhythm |
| [Rhythm Machine](../apps/rhythm-machine/) | `rhythm-machine` | Ring seq · draw, Euclid, L-system | Touch | Euclidean and generative rhythm · Time and rhythm |
| [Shadow Sequencer](../apps/shadow-sequencer/) | `shadow-sequencer` | 8-step mask | Camera · touch | Optical sensing as score · Vision |

## Drones & motion

| App | Folder | Synth / role | Sensors | Teaches |
|-----|--------|--------------|---------|---------|
| [Compass Wah](../apps/compass-wah/) | `compass-wah` | Compass wah or choir | Touch · compass · tilt | Orientation as control · The body |
| [Green Button](../apps/green-button/) | `green-button` | Swarm tones | Touch · motion | Swell, vibrato, ensemble density · Electroacoustics |
| [Harmonizer](../apps/harmonizer/) | `harmonizer` | Chroma drones | Mic · touch | Chroma and room harmony · Machine listening |
| [Just Equal](../apps/just-equal/) | `just-equal` | Detuned sines | Touch | Just vs equal temperament · Harmony and melody |
| [Micromotion](../apps/micromotion/) | `micromotion` | Band-split stillness voices | Motion · gyro (optional) | Motion bands and sensor limits · The body |
| [Motion Filter](../apps/motion-filter/) | `motion-filter` | Tilt · shake · ladder · flat | Touch · motion · tilt | Action–sound mappings · The body |
| [Shepard Glide](../apps/shepard-glide/) | `shepard-glide` | Shepard tone | Touch · tilt | Shepard illusion · Psychoacoustics |
| [Sound Saber](../apps/sound-saber/) | `sound-saber` | Pulse · delay · ring | Touch · motion | Motion as timbre · The body |
| [Standstill](../apps/standstill/) | `standstill` | Inverse stillness bloom | Motion · tilt | Micromotion and standstill · The body |
| [Swarm Bloom](../apps/swarm-bloom/) | `swarm-bloom` | Evo drones + rhythm | Mic · ensemble | Emergent ensemble roles · The body |

## Melody

| App | Folder | Synth / role | Sensors | Teaches |
|-----|--------|--------------|---------|---------|
| [Bow Phone](../apps/bow-phone/) | `bow-phone` | Bowed string | Touch · camera | Continuous excitation · The body |
| [Bowed Waveguide](../apps/bowed-waveguide/) | `bowed-waveguide` | Continuous KS | Touch drag | Physical modelling (bowed) · Electroacoustics |
| [Crystalis](../apps/crystalis/) | `crystalis` | Bowed band · grid pluck | Keyboard · touch pad | Ensemble grid performance · Time and rhythm |
| [Flute Blow](../apps/flute-blow/) | `flute-blow` | Breath tone | Mic · touch | Excitation and resonance · Acoustics |
| [Kaoss Pad](../apps/kaoss-pad/) | `kaoss-pad` | XY loop synth | Touch pad | Scales and quantization · Harmony and melody |
| [Markov Melody](../apps/markov-melody/) | `markov-melody` | 2nd-order Markov | Touch · keyboard | Markov chains · Machine listening |
| [Mic Theremin](../apps/mic-theremin/) | `mic-theremin` | Pitch-tracked sine | Mic · touch | Pitch tracking · Machine listening |
| [Piano](../apps/piano/) | `piano` | Keyboard tones | Touch | Pitch reference, voice-leading · Harmony and melody |
| [Tilt Harp](../apps/tilt-harp/) | `tilt-harp` | Plucked harp | Touch · tilt | Damping and decay · Acoustics |

## Synthesis

| App | Folder | Synth / role | Sensors | Teaches |
|-----|--------|--------------|---------|---------|
| [Additive Bells](../apps/additive-bells/) | `additive-bells` | Additive partials | Touch · motion | Additive synthesis, Fourier · Acoustics |
| [FM Touch](../apps/fm-touch/) | `fm-touch` | 2-op FM · finger or tilt | Touch · tilt | FM synthesis · Electroacoustics |
| [KS String](../apps/ks-string/) | `ks-string` | KS · pluck position | Touch · tilt | Physical modelling (Karplus–Strong) · Electroacoustics |
| [Mapping Roulette](../apps/mapping-roulette/) | `mapping-roulette` | Remappable saw voice | Touch · drag speed | Coupling vs mapping · The body |
| [Pinch Bass](../apps/pinch-bass/) | `pinch-bass` | Subtractive bass | Pinch · XY | Cross-coupled mapping · The body |
| [Pluck Bowl](../apps/pluck-bowl/) | `pluck-bowl` | KS + LFO layers | Touch position | Inharmonic partials, strike position · Acoustics |
| [Synth Tour](../apps/synth-tour/) | `synth-tour` | FM · ring · AM · PD · wavetable · supersaw | Touch · mic · gyro | Synthesis techniques compared · Electroacoustics |

## Texture

| App | Folder | Synth / role | Sensors | Teaches |
|-----|--------|--------------|---------|---------|
| [Chaos Attractor](../apps/chaos-attractor/) | `chaos-attractor` | Chaotic subtractive | Touch · motion | Sensitivity to initial conditions · Electroacoustics |
| [Granular Tilt](../apps/granular-tilt/) | `granular-tilt` | Granular cloud | Touch · tilt · mic | Granular synthesis · Electroacoustics |
| [Room Reverb Send](../apps/room-reverb-send/) | `room-reverb-send` | Convolver wet | Mic · touch | Reverberation and feedback · Acoustics |
| [Sampler](../apps/sampler/) | `sampler` | Sample playback | Mic · touch · tilt | Sampling · Electroacoustics |
| [Scrub Tape](../apps/scrub-tape/) | `scrub-tape` | Buffer scrub | Mic · tape ribbon | Tape speed: time–pitch coupling · Electroacoustics |
| [Spectral Freeze](../apps/spectral-freeze/) | `spectral-freeze` | FFT partials · freeze or soup | Mic · touch | Spectrum, FFT, averaging · Acoustics |
| [Tap Bloom](../apps/tap-bloom/) | `tap-bloom` | Generative blooms | Touch | Generative layering and reverb · Electroacoustics |
| [Video Sonifier](../apps/video-sonifier/) | `video-sonifier` | Camera → sound | Camera | Sonification of visual motion · Vision |
| [Vocoder Choir](../apps/vocoder-choir/) | `vocoder-choir` | Band vocoder | Mic · tilt · touch | Source–filter model, formants · Acoustics |
| [Wind Bottle](../apps/wind-bottle/) | `wind-bottle` | Noise resonator | Tilt · touch | Noise and resonance · Acoustics |

## AI & learning

| App | Folder | Synth / role | Sensors | Teaches |
|-----|--------|--------------|---------|---------|
| [Evo Drumkit](../apps/evo-drumkit/) | `evo-drumkit` | Evolving drums | Touch · mic | Evolutionary algorithms · Machine listening |
| [Gesture Regression](../apps/gesture-regression/) | `gesture-regression` | ML → filter | Motion · touch | Nearest-neighbour regression · Machine listening |
| [Hum Clap](../apps/hum-clap/) | `hum-clap` | k-NN classifier | Mic | Audio classification · Machine listening |
| [Train Shake](../apps/train-shake/) | `train-shake` | ML gesture map | Motion | Rule-based vs learned models · Machine listening |

## Consolidated instruments (legacy URLs redirect)

Several earlier apps became **modes** of a canonical instrument. Old links and QR codes keep working:

| Old app | Now |
|---------|-----|
| `audience` | `green-button/` |
| `circular-drum` | `rhythm-machine/?gen=draw` |
| `color-band` | `video-sonifier/` |
| `drone-choir` | `just-equal/` |
| `edge-strum` | `ks-string/` |
| `euclidean-rings` | `rhythm-machine/?gen=euclid` |
| `filter-ladder` | `motion-filter/?mode=ladder` |
| `flat-edge` | `motion-filter/?mode=flat` |
| `fm-matrix` | `synth-tour/?engine=fm` |
| `fm-touch-tilt` | `fm-touch/?mod=tilt` |
| `gyro-whirl` | `synth-tour/?engine=supersaw&timbre=spin` |
| `heading-choir` | `compass-wah/?mode=choir` |
| `hold-loop-tilt` | `sampler/` |
| `ks-pluck` | `ks-string/` |
| `lsystem-groove` | `rhythm-machine/?gen=lsystem` |
| `motion-grid` | `video-sonifier/` |
| `motion-wah` | `motion-filter/?mode=tilt` |
| `am-radio` | `synth-tour/?engine=am` |
| `phase-distortion` | `synth-tour/?engine=pd` |
| `ring-mod-gong` | `synth-tour/?engine=ring` |
| `shake-filter` | `motion-filter/?mode=shake` |
| `spectral-soup` | `spectral-freeze/?mode=soup` |
| `supersaw-stack` | `synth-tour/?engine=supersaw` |
| `wavetable-scan` | `synth-tour/?engine=wavetable` |

## Retired from hub

Removed or stubbed experiments include One Shot Orchestra, Part, Pitch Hive, Pocket Metronome, Synth Pad, Tilt Doppler, Torch Pulse, Whisper Gate, Light Theremin, Grain Rain, Haptic Click, Battery Drone, Geo Drone, Pressure Pad, PWM Bass, Hard Sync Lead, IR Cathedral, Live Loop Slicer. See [Ideas](https://github.com/fourMs/omo/blob/main/docs/IDEAS.md) in the repo.
