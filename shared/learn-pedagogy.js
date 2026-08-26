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

  clix: [
    "After Ge Wang’s CliX (SMELT / PLOrk): each key is a pitch from its ASCII code; a shared 8×4 grid scan sets how loud each strike is when the clock arrives.",
    "Hold any key (numbers or letters) to retrigger on every grid pulse — the same character can whisper or shout as the orange cell moves; release to stop.",
  ],

  drumkit: [
    "Each pad triggers a synthesized drum: oscillators and noise bursts shaped by envelopes to mimic kick, snare, and hats.",
    "Teaches discrete rhythm — short attacks, clear onsets — and how timbre identifies drum type even at low volume.",
  ],

  "drum-sequencer": [
    "A step sequencer stores on/off hits on a grid; a clock steps through columns and triggers drums when a step is lit.",
    "Players program patterns, then hear how repetition and syncopation create groove.",
  ],

  "rhythm-machine": [
    "Steps sit on a ring and a playhead sweeps clockwise; the cyclic layout makes phase and polyrhythm visible. Three pattern sources feed the same ring: hand-drawn steps, Euclidean rhythms E(k,16) that spread hits as evenly as possible, and an L-system that rewrites the pattern every bar.",
    "The same formula E(k,n) underlies many world musics and techno patterns; the L-system shows structure growing from a two-symbol grammar. Compare sources: how does groove differ when a hand, a formula, or a grammar wrote it?",
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
    "Hold the screen and rotate flat — in Wah mode the compass heading sweeps a lowpass filter while tilt and shake add volume and vibrato; in Choir mode five detuned voices sit around the rose and the section you face sings loudest.",
    "Many sensor dimensions on one instrument: mapping design makes the same sensors feel like different instruments, and where you face in the room becomes your place in the mix.",
  ],

  "motion-filter": [
    "One saw tone, one filter, four action–sound mappings: tilt sweeps a wah bandpass, shakes jerk a lowpass open, a four-stage ladder (Moog-style, ≈24 dB/oct) follows pad and tilt, and Flat gates sound to a tabletop pose.",
    "The synth never changes — only the mapping does. Compare mappings to feel how mapping design, not synthesis, makes an instrument.",
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

  "synth-tour": [
    "Six synthesis engines behind one pad: FM (sidebands from frequency wobble, with routable modulation), ring modulation (sum and difference tones), AM (radio-style sidebands, mic-driven depth), phase distortion (Casio-style waveshaping), wavetable morphing (smooth travel between stored cycles), and a supersaw stack (detuned saw chorus, gyro-widened).",
    "Because the gesture never changes — X is always pitch — every difference you hear is the synthesis technique itself. Tour the engines and compare spectra by ear.",
  ],

  "ks-string": [
    "Karplus–Strong synthesis: a short delay loop with filtering mimics a vibrating string. A noise burst sets it ringing.",
    "Pluck position matters like on a guitar — near the rim emphasizes high harmonics (picking near the bridge), the centre is warmer; tilt controls decay (damping).",
  ],

  "additive-bells": [
    "A tone is built from many sine partials at harmonic ratios; motion or hit strength shapes the mix.",
    "Demonstrates Fourier idea: timbre = which partials are loud; bells have inharmonic partials in real life, simplified here.",
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
    "Analysis splits sound into partials or bands; freezing holds one spectral snapshot, while Soup mode averages the spectrum for as long as you hold, thickening into a pad.",
    "Bridges spectral thinking — timbre as a set of frequencies, not only a single waveform; snapshot vs average shows two ways to summarise a changing spectrum.",
  ],

  "tap-bloom": [
    "Each tap plants one pentatonic tone that repeats every four seconds — same pitch, steady rhythm, long decay and reverb.",
    "Generative ambient play — minimal gesture, layered blooms; vertical position chooses pitch height.",
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

  "mapping-roulette": [
    "On acoustic instruments the action–sound link is a coupling, bundled with the physics; on electronic instruments it is a mapping — a design decision that can be redealt at any time. Scramble does exactly that.",
    "Hunt & Wanderley found one-to-one mappings are not necessarily best: harder, cross-coupled mappings (one movement affecting several parameters, like a violin bow) were more engaging and, with practice, supported better performance. Test it on yourself.",
  ],

  "pinch-bass": [
    "Two-finger pinch: the centre of the pair sets pitch (X) and filter cutoff (Y); spread controls level and resonance. One finger defaults to 25% spread.",
    "Continuous bass control — move the gesture around the pad without lifting to sweep timbre and sub weight.",
  ],

  crystalis: [
    "After Ge Wang’s Crystalis: up to four bowed bands; drag on the pad bows by direction (like a trackpad); letter keys pick pitch in a register.",
    "Pluck mode fires the whole ensemble on a shared grid pulse — velocity comes from the 8×4 pattern, like the original OSC server.",
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

  standstill: [
    "An inverse action–sound mapping: quantity of motion closes the gate, so sound exists only while you hold still — the opposite of every other instrument here.",
    "Nobody reaches zero: research on the standstill paradigm finds ~6.5 mm/s of head micromotion in people trying their best. That residue steers brightness and stereo position, following the Oslo Standstill Database sonification (log-scaled motion → filter brightness, never pitch).",
  ],

  micromotion: [
    "The motion left in a still body is split into bands: slow postural sway (below ~1 Hz), fast tremor and heartbeat (~2–8 Hz), and rotation from the gyroscope — each band drives its own voice.",
    "Also a lesson in sensing: accelerometers measure acceleration, not position, and phones without a gyroscope estimate rotation from tilt — the readout shows which source you are hearing.",
  ],

  // Legacy URLs (redirect apps) — same pedagogy as canonical instrument
  "hold-loop-tilt": "See Sampler: hold the centre button to record, release to loop, tilt to shape.",
  "spectral-soup": "See Spectral Freeze → Soup mode: the spectrum is averaged while you hold, playing back as a live pad.",
  "edge-strum": "See KS String: pluck near the rim for bright, bridge-like harmonics; the centre is warmer.",
  "motion-wah": "See Motion Filter → Tilt wah: forward/back sweeps the bandpass, sideways sets resonance.",
  "shake-filter": "See Motion Filter → Shake: accelerometer jerks open the lowpass.",
  "flat-edge": "See Motion Filter → Flat gate: sound only while the phone lies flat.",
  "filter-ladder": "See Motion Filter → Ladder: four lowpass stages, pad Y and tilt set cutoff.",
  "heading-choir": "See Compass Wah → Choir: turn your body and the section you face sings loudest.",
  "circular-drum": "See Rhythm Machine → Draw: tap ring segments to toggle hits.",
  "euclidean-rings": "See Rhythm Machine → Euclid: E(k,16) rings with per-ring phase.",
  "lsystem-groove": "See Rhythm Machine → L-system: the pattern rewrites every bar.",
  "fm-matrix": "See Synth Tour → FM: routable two-operator FM with the same 2×2 matrix.",
  "ring-mod-gong": "See Synth Tour → Ring mod: two sines multiplied into gong-like sidebands.",
  "am-radio": "See Synth Tour → AM radio: mic level drives modulation depth.",
  "phase-distortion": "See Synth Tour → Phase dist: two fingers split pitch and distortion.",
  "wavetable-scan": "See Synth Tour → Wavetable: morph across eight single-cycle waves.",
  "supersaw-stack": "See Synth Tour → Supersaw: detuned saw stack, gyro widens the spread.",
  "ks-pluck": "See Resonant Wire → Pocket range: wider pitch span, same Karplus–Strong model.",
  "fm-touch-tilt": "See FM Fingerpaint → Tilt mod: modulator rate from phone angle.",
  "motion-grid": "See Motion Cam: frame differencing drives density.",
  "color-band": "See Motion Cam: dominant hue selects scale degree.",
  "gyro-whirl": "See Synth Tour → Supersaw, Spin timbre: gyro-driven vibrato on a sine tone.",
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
