/**
 * Pedagogical “How it works” copy for Learn panels (by app folder slug).
 * Injected automatically by bindLearn() — keep how-to-play text in each app HTML.
 */

/** @type {Record<string, string | string[]>} */
export const LEARN_PEDAGOGY = {
  hub: [
    "Each card is a small browser instrument: a sound engine plus one or more phone sensors (touch, motion, mic, camera).",
    "In workshops, distribute different apps across the group so timbre and gesture vary, then listen for how the ensemble blends.",
  ],

  conductor: [
    "A shared pulse keeps many players aligned in time. The phone plays a short click on each beat; everyone who opens the same link hears the same tempo.",
    "Pedagogically this trains ensemble listening: lock to the group pulse instead of your internal clock.",
  ],

  drumkit: [
    "Each pad triggers a synthesized drum: oscillators and noise bursts shaped by envelopes to mimic kick, snare, and hats.",
    "Teaches discrete rhythm — short attacks, clear onsets — and how timbre identifies drum type even at low volume.",
  ],

  "drum-sequencer": [
    "A step sequencer stores on/off hits on a grid; a clock steps through columns and triggers drums when a step is lit.",
    "Players program patterns, then hear how repetition and syncopation create groove.",
  ],

  "circular-drum": [
    "Steps are placed on a ring; the playhead travels around the circle like a rotary sequencer.",
    "Same idea as linear steps, but the cyclic layout highlights phase and polyrhythm when rings run at different lengths.",
  ],

  firefly: [
    "Each phone listens for sharp sounds (claps, taps) and flashes a pulse; the group tries to align pulses without a central metronome.",
    "Models biological synchrony: local reaction to neighbours, emergent shared tempo.",
  ],

  "delay-throw": [
    "A tap records energy into a delay line; feedback sends the sound back, so each gesture leaves a fading trail.",
    "Tilt or drag controls delay time and feedback — longer delay = more space between echoes; more feedback = denser texture.",
  ],

  "evo-drumkit": [
    "Patterns can mutate over time: small random changes to steps or sounds, guided by rules and sometimes mic input.",
    "Introduces evolution as a compositional idea — variation within constraints, not pure random noise.",
  ],

  "green-button": [
    "Hold the green circle to swell a sine drone; finger motion inside adds vibrato and shimmer.",
    "Simple hold-to-play drone — one big button, collective density when many phones swell together.",
  ],

  "just-equal": [
    "Several sine oscillators are detuned slightly so beating and roughness appear; holding a note sustains a chord tone.",
    "Teaches just intonation vs equal temperament by ear, and how ensemble drones need stable pitch and balance.",
  ],

  "sound-saber": [
    "Based on the fourMs Sound Saber: a bright pulse feeds two feedback delays and ring modulation, then a bandpass filter.",
    "Swing speed maps to loudness; tilt and direction shape filter and modulation — motion becomes timbre, not only volume.",
  ],

  "compass-wah": [
    "Hold the screen and rotate flat — compass heading sweeps a lowpass filter while tilt and shake add volume and vibrato.",
    "Many sensor dimensions on one filtered tone: mapping design makes the same synth feel like a new instrument.",
  ],

  "motion-wah": [
    "A bandpass filter follows phone tilt: forward/back sweeps wah frequency, sideways changes resonance.",
    "Classic motion-controlled timbre — the body becomes the filter knob without touching the screen after the initial hold.",
  ],

  "shake-filter": [
    "Hold for a steady tone; sudden accelerometer jerks open the filter cutoff and resonance.",
    "Onset and gesture energy map to brightness — sharp physical moves become audible swells.",
  ],

  "flat-edge": [
    "The drone only sounds when the phone lies flat on a table; tilt away and the gate closes.",
    "Orientation as an on/off condition — useful for tabletop ensemble games and deliberate stillness.",
  ],

  "heading-choir": [
    "Hold and turn your body — compass heading pans a detuned choir in stereo.",
    "Spatial ensemble: where you face in the room becomes your place in the mix.",
  ],

  harmonizer: [
    "The mic estimates chord colour (chroma) from the room; the app holds related pitches as a drone choir.",
    "Players hear how harmony in the environment steers the electronics — acoustic context becomes part of the patch.",
  ],

  piano: [
    "Each key triggers a short, bright tone (sine or mallet-like envelope) at a fixed pitch.",
    "Supports melody, voice-leading, and ensemble pitch reference; works well when other parts are drone or rhythm.",
  ],

  "mic-theremin": [
    "Pitch is estimated from your humming or whistling; the phone tracks fundamental frequency and drives a sine tone.",
    "Links vocal intonation to electronic pitch — useful for ear training and for one melodic line without a keyboard.",
  ],

  "flute-blow": [
    "Breath noise into the mic opens a gate; finger holes on screen choose pitch like a simple flute.",
    "Combines excitation (breath) with resonance (pitch selection) — you must control both to phrase musically.",
  ],

  "tilt-harp": [
    "Plucked or struck string models (Karplus–Strong or similar) with pitch from touch and damping from tilt.",
    "Tilt as “string length” or damping teaches that gesture after the attack still shapes the sound.",
  ],

  "bow-phone": [
    "Camera motion or hand position sustains a bowed-string-like tone: continuous excitation instead of one pluck.",
    "Bridges visual/motor control and sustained tone — closer to violin phrasing than percussion.",
  ],

  "fm-touch": [
    "Frequency modulation (FM): one oscillator modulates another’s frequency, creating sidebands and metallic or bell-like spectra.",
    "Finger or tilt chooses carrier and modulator rates — small ratio changes produce large timbral shifts.",
  ],

  "fm-matrix": [
    "Several FM pairs are mixed; the grid sets levels or indices like a modular patch.",
    "Players explore complex spectra by combining simple two-operator blocks.",
  ],

  "ks-string": [
    "Karplus–Strong synthesis: a short delay loop with filtering mimics a vibrating string. A noise burst sets it ringing.",
    "Pluck position and strength change pitch and brightness; tilt often controls decay (damping).",
  ],

  "additive-bells": [
    "A tone is built from many sine partials at harmonic ratios; motion or hit strength shapes the mix.",
    "Demonstrates Fourier idea: timbre = which partials are loud; bells have inharmonic partials in real life, simplified here.",
  ],

  "filter-ladder": [
    "A ladder-style lowpass filter (Moog-like) removes highs; resonance emphasizes the cutoff edge.",
    "Classic subtractive bass/leads — sweep the cutoff to feel formant-like vowels or wah effects.",
  ],

  "ring-mod-gong": [
    "Ring modulation multiplies two signals, producing sum and difference frequencies — often inharmonic, gong-like.",
    "Touch maps carrier and modulator; inharmonic relationships avoid obvious pitch center.",
  ],

  sampler: [
    "Hold the centre record button to capture audio, then release to loop. Tilt shifts filter, delay, pitch — and the button colour (cool when upright, warmer as you lean).",
    "Links everyday sound (field recording) to musical time-stretching and collage.",
  ],

  "granular-tilt": [
    "Many tiny slices of sound (grains) overlap; density and position create clouds or textures.",
    "Mic or buffer supplies material; tilt scatters grains — time is shredded and reassembled.",
  ],

  "spectral-freeze": [
    "Analysis splits sound into partials or bands; freezing holds the spectrum while you reshape or sustain.",
    "Bridges spectral thinking — timbre as a set of frequencies, not only a single waveform.",
  ],

  "tap-bloom": [
    "Each tap plants one pentatonic tone that repeats every four seconds — same pitch, steady rhythm, long decay and reverb.",
    "Generative ambient play — minimal gesture, layered blooms; vertical position chooses pitch height.",
  ],

  "wavetable-scan": [
    "A single cycle waveform is stored; scanning through tables or morphing shapes changes harmonics smoothly.",
    "Between pure sine and complex buzz; good for evolving pads and digital timbres.",
  ],

  "video-sonifier": [
    "Camera frames are compared for motion or brightness; changes map to pitch, density, or level.",
    "Vision becomes control — stillness vs activity in the room directly shapes the electronics.",
  ],

  "hum-clap": [
    "Short mic features are classified (hum vs clap) with a small learner; each class triggers a different response.",
    "Introduces supervised learning on the phone: train examples, then test in performance.",
  ],

  "train-shake": [
    "You record gesture examples; the app maps new motion to parameters (filter, pitch, etc.).",
    "Embodied ML: your movement vocabulary becomes the interface.",
  ],

  "kaoss-pad": [
    "Inspired by the Korg Kaossilator: an X–Y pad sets quantized pitch and filter colour while a short loop retriggers sixteenth notes.",
    "Lead program plays scale tones; Beat program maps horizontal position to kick, snare, and hats — drag while holding to morph the phrase.",
  ],

  "markov-melody": [
    "Each new note depends on the previous one or two (Markov chain); the keyboard trains probabilities, then auto-plays.",
    "Stochastic melody — structure without a fixed score; compare human vs machine choices.",
  ],

  "euclidean-rings": [
    "Euclidean rhythm distributes k hits evenly among n steps; rotating rings place polymetric grids.",
    "Mathematical rhythm — same formula underlies many world musics and techno patterns.",
  ],

  "lsystem-groove": [
    "An L-system rewrites a symbol string; symbols map to drum hits, growing patterns over generations.",
    "Algorithmic composition: simple rules, complex output — fractal-like rhythmic growth.",
  ],

  "chaos-attractor": [
    "A chaotic map (e.g. Lorenz-style) drives filter or pitch; tiny changes grow into large swings.",
    "Deterministic but unpredictable — sensitivity to initial conditions as a performance parameter.",
  ],

  "shepard-glide": [
    "Overlapping sine partials wrap in log-frequency space so the illusion can run without drifting into silence.",
    "Hold the pad for continuous glide; tilt sets speed and direction — psychoacoustic endless rise or fall.",
  ],

  "room-reverb-send": [
    "Mic level in the room increases send to a reverb (convolution or algorithmic); louder room = wetter sound.",
    "Acoustic feedback loop: the space you are in changes the processed signal.",
  ],

  "clap-architect": [
    "Onset times of claps are detected and placed on a grid; spacing defines tempo and pattern.",
    "Rhythm from the body — the architecture of claps becomes a score.",
  ],

  "shadow-sequencer": [
    "Camera brightness in zones becomes an 8-step pattern; hand shadows toggle steps.",
    "Optical sequencing — visible gesture is the score.",
  ],

  "pinch-bass": [
    "Two-finger pinch: the centre of the pair sets pitch (X) and filter cutoff (Y); spread controls level and resonance. One finger defaults to 25% spread.",
    "Continuous bass control — move the gesture around the pad without lifting to sweep timbre and sub weight.",
  ],

  "edge-strum": [
    "Touch position near the edge emphasizes higher harmonics in a string model; centre is more fundamental.",
    "Spatial playing on one surface — same as picking near the bridge on a guitar.",
  ],

  "am-radio": [
    "Amplitude modulation: a slow oscillator multiplies level, creating sidebands around the carrier — radio-like.",
    "Mic may replace the modulator — voice or room sound heterodynes with the tone.",
  ],

  "phase-distortion": [
    "Phase of a sine readout is shaped before conversion to audio — Casio-style digital colour.",
    "Two fingers split pitch and distortion so you can hold a note while morphing timbre; smoothed curves reduce clicks.",
  ],

  "supersaw-stack": [
    "Several detuned sawtooth oscillators stack for a wide chorus; gyro widens detune further.",
    "Spin timbre uses sine + vibrato for a smoother, rotating stereo image.",
  ],

  "bowed-waveguide": [
    "Karplus–Strong plucks at a steady rate give the pitch; a very quiet bow layer adds sustain without runaway feedback.",
    "Drag speed sets bow energy; vertical position chooses note — slow bowing sounds rounder, fast a little brighter.",
  ],

  "pluck-bowl": [
    "Karplus plucks plus six inharmonic partials share a filter; many slow LFOs evolve level, tone, and stereo width between strikes.",
    "Strike position sets root pitch and edge brightness — centre is warmer, the rim sharper and longer.",
  ],

  "wind-bottle": [
    "Hold the centre button — filtered noise with feedback sounds like blowing across a bottle.",
    "Tilt controls peak frequency and breath amount; no microphone required.",
  ],

  "scrub-tape": [
    "Hold the centre record button to capture audio, then drag the full-width tape ribbon to scrub through the buffer.",
    "Faster scrubbing shifts pitch like a tape head — position is horizontal along the ribbon.",
  ],

  "vocoder-choir": [
    "Hold the centre button and sing — mic energy opens bandpass carriers for a choir-like vocoder.",
    "A carrier tone is filtered by bands shaped from mic input — speech formants on a synth.",
    "Robot voice effect; choir when carrier is rich and modulation is smooth.",
  ],

  "gesture-regression": [
    "Each phone tilt you save while holding the pad becomes a colored dot and its own timbre.",
    "In Play, tilting picks the nearest dot — nearest-neighbor mapping from gesture to sound.",
  ],

  "swarm-bloom": [
    "Combines pulsed sync, harmonic listening, and evolving textures — ensemble layers from several OMO ideas.",
    "For large groups: some parts pulse, some hold harmony, some evolve — discuss roles before playing.",
  ],

  // Legacy URLs (redirect apps) — same pedagogy as canonical instrument
  "ks-pluck": "See Resonant Wire → Pocket range: wider pitch span, same Karplus–Strong model.",
  "fm-touch-tilt": "See FM Fingerpaint → Tilt mod: modulator rate from phone angle.",
  "motion-grid": "See Motion Cam: frame differencing drives density.",
  "color-band": "See Motion Cam: dominant hue selects scale degree.",
  "gyro-whirl": "See Blade Chorus → Spin timbre: gyro-driven vibrato on a sine tone.",
};

export function slugFromAppPath(pathname = location.pathname) {
  const m = pathname.match(/apps\/([^/]+)/);
  return m ? m[1] : null;
}

/**
 * Append pedagogical block to a Learn panel (idempotent).
 * @param {string} [panelId]
 * @param {string} [slugOverride] e.g. "hub" on index.html
 */
export function injectLearnPedagogy(panelId = "learnPanel", slugOverride) {
  const panel = document.getElementById(panelId);
  if (!panel || panel.querySelector(".learn-pedagogy")) return;

  const slug = slugOverride ?? slugFromAppPath();
  if (!slug) return;

  const entry = LEARN_PEDAGOGY[slug];
  if (!entry) return;

  const paras = Array.isArray(entry) ? entry : [entry];
  const wrap = document.createElement("div");
  wrap.className = "learn-pedagogy";
  wrap.innerHTML =
    "<h3>How it works</h3>" + paras.map((p) => `<p>${p}</p>`).join("");
  panel.appendChild(wrap);
}
