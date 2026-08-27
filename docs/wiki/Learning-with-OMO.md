# Learning with OMO

Every OMO instrument is a small, inspectable experiment in how action becomes sound. This page connects the collection to the textbook [Sensing Sound and Music](https://fourms.github.io/sensingsoundandmusic/) (MUS2640, UiO), so you can use the apps not only to play together but to *feel* the concepts you read about. The [App catalog](App-Catalog) lists what each instrument teaches; this page gives you the frameworks to ask better questions of them.

## Four levels of description

The book's organising framework: any claim about sound belongs to one of four levels — the physical signal (pressure waves in air), the digital representation (numbers, filters, synthesis), perception (what the ear makes of it), and interpretation (what it means to a listener). Every OMO app spans all four, and it is worth asking, for any instrument you play: *which level am I hearing right now?*

Take [Shepard Glide](https://fourms.github.io/omo/apps/shepard-glide/): at the digital level it is a handful of sine partials wrapping in log-frequency space; at the physical level nothing rises forever; at the perceptual level the pitch climbs without end — the illusion *is* the gap between levels. Or [Just Equal](https://fourms.github.io/omo/apps/just-equal/): the digital difference between just and equal temperament is a few cents in oscillator tuning; the perceptual difference is beating and roughness you can hear directly.

## Movement, motion, action

The book distinguishes movement (the subjective, experiential side — what a gesture feels and looks like) from motion (the measurable, physical quantity a sensor records). We *experience movement*, but we *analyse motion*. Your phone's accelerometer knows nothing about your intentions; it reports metres per second squared. Every OMO instrument is a translation from one to the other.

Performer actions come in four kinds, on a continuum of connection to the sound:

- Sound-producing — actions that directly generate sound: *selection* (choosing a pitch on [Piano](https://fourms.github.io/omo/apps/piano/)), *excitation* (plucking [KS String](https://fourms.github.io/omo/apps/ks-string/), tapping [Drumkit](https://fourms.github.io/omo/apps/drumkit/)), *modification* (tilting to damp the string after the pluck).
- Sound-facilitating — support movements that don't sound themselves: how you hold the phone, the arm that carries the gesture.
- Sound-accompanying — moving *to* sound rather than to produce it: swaying with the ensemble, air-playing.
- Communicative — cueing, conducting ([Conductor](https://fourms.github.io/omo/apps/conductor/) turns this into an app).

Watch a group play and you will see all four at once. [Standstill](https://fourms.github.io/omo/apps/standstill/) deliberately breaks the scheme: there the sound-producing "action" is the *suppression* of action.

## Coupling versus mapping

On an acoustic instrument, the link between action and sound is an action–sound coupling: lawful, mechanical, bundled with the physics. Hit harder, get louder — no one decided that; the world did. On an electronic instrument the link is an action–sound mapping: a design decision that could always have been otherwise, and can be reprogrammed at any time.

Two apps make this distinction playable:

- [Mapping Roulette](https://fourms.github.io/omo/apps/mapping-roulette/) re-deals the mapping while you play. Practice a phrase, press *Scramble*, and your practiced gesture suddenly means something else — something no acoustic instrument could ever do to you.
- [Motion Filter](https://fourms.github.io/omo/apps/motion-filter/) holds the synth constant (one saw, one filter) and lets you swap among four sensor mappings. Same sound engine, four different *instruments*.

A closer look: does a better instrument need a simpler mapping?
*Claim:* one-to-one mappings (one control per parameter, like a mixing desk) are not necessarily best for musical instruments. *Evidence:* Hunt & Wanderley had participants control pitch, loudness, and timbre through interfaces that were either one-to-one or cross-coupled, where a single movement affects several parameters at once, more like a violin bow. The cross-coupled mappings were harder — and more engaging, and with practice supported better performance on the demanding tasks. *Method:* small lab study, short sessions, simple sounds. *Limits:* around a dozen participants, engagement partly self-reported. *Try it:* [Pinch Bass](https://fourms.github.io/omo/apps/pinch-bass/) is deliberately cross-coupled (finger spread drives level *and* resonance together — opening your hand makes the sound "grow", not just get louder); Mapping Roulette's *Cross-couple* button deals you a random bow.

## A synthesis map

The Electroacoustics chapter builds synthesis from blocks: oscillator → filter → envelope. The apps let you hear each block and technique in isolation:

| Technique | Hear it in | Notes |
|-----------|-----------|-------|
| Subtractive (osc → filter) | [Motion Filter](https://fourms.github.io/omo/apps/motion-filter/), [Pinch Bass](https://fourms.github.io/omo/apps/pinch-bass/) | cutoff and resonance under gesture control |
| Additive (sum of sines) | [Additive Bells](https://fourms.github.io/omo/apps/additive-bells/), [Spectral Freeze](https://fourms.github.io/omo/apps/spectral-freeze/) | timbre = which partials are loud |
| FM | [FM Touch](https://fourms.github.io/omo/apps/fm-touch/), [Synth Tour → FM](https://fourms.github.io/omo/apps/synth-tour/?engine=fm) | sidebands from frequency wobble; try the routing matrix |
| AM / ring modulation | [Synth Tour → AM / Ring](https://fourms.github.io/omo/apps/synth-tour/) | sum and difference tones; AM keeps the carrier, ring removes it |
| Wavetable | [Synth Tour → Wavetable](https://fourms.github.io/omo/apps/synth-tour/?engine=wavetable) | morphing between stored single cycles |
| Sampling | [Sampler](https://fourms.github.io/omo/apps/sampler/), [Scrub Tape](https://fourms.github.io/omo/apps/scrub-tape/) | recording as instrument; scrubbing couples time and pitch |
| Granular | [Granular Tilt](https://fourms.github.io/omo/apps/granular-tilt/), [Spectral Freeze](https://fourms.github.io/omo/apps/spectral-freeze/) | tens-of-milliseconds grains; time shredded and reassembled |
| Physical modelling | [KS String](https://fourms.github.io/omo/apps/ks-string/), [Bowed Waveguide](https://fourms.github.io/omo/apps/bowed-waveguide/), [Pluck Bowl](https://fourms.github.io/omo/apps/pluck-bowl/) | a delay loop *behaves like* a string — a topic the book only touches, explored here in code |

[Synth Tour](https://fourms.github.io/omo/apps/synth-tour/) exists precisely for comparison: X is always pitch, so every difference you hear between engines is the synthesis technique itself.

## Playing together: entrainment

Entrainment is the synchronisation of one rhythmic system with another — physically, the behaviour of coupled oscillators: two systems that influence each other, however weakly, tend to fall into a stable phase relationship rather than drift. In an ensemble, the oscillators are people.

[Firefly](https://fourms.github.io/omo/apps/firefly/) is the live demo: each phone listens for onsets from its neighbours and nudges its own pulse, and the Tempo / Lock % / Offset readouts let you *watch* a group clock emerge without any conductor. Compare with [Conductor](https://fourms.github.io/omo/apps/conductor/), where the clock is imposed. Which feels more musical? Which is tighter? (Expect ~50–100 ms spread either way — a good number to connect to the perceptual thresholds in the Time and rhythm chapter.)

## Machine listening and learning

The Machine listening chapter distinguishes rule-based systems (peak picking, thresholds — compact, interpretable, fast) from learning-based systems (trained on examples — more accurate, needing data, harder to interpret). OMO contains both, and the contrast is the lesson:

- Rule-based: [Clap Architect](https://fourms.github.io/omo/apps/clap-architect/) and [Firefly](https://fourms.github.io/omo/apps/firefly/) detect onsets with thresholds; [Mic Theremin](https://fourms.github.io/omo/apps/mic-theremin/) tracks pitch.
- Learning-based: [Train & Shake](https://fourms.github.io/omo/apps/train-shake/) classifies your motion from examples you record; [Hum Clap](https://fourms.github.io/omo/apps/hum-clap/) does the same for audio; [Gesture Regression](https://fourms.github.io/omo/apps/gesture-regression/) maps tilt to timbre by nearest neighbour.

Read the model's output critically, as the book insists: when Train & Shake mislabels your sway as a shake, *why*? What could confuse it — your phone, your body, your training set?

## Exercises

1. Pick any instrument and describe it at all four levels of description: what is the signal, what is the code doing, what do you perceive, what does it mean in the ensemble?
2. Play a 30-second phrase on [Mapping Roulette](https://fourms.github.io/omo/apps/mapping-roulette/) in Natural mode, then Scramble and play the same phrase. Time how long it takes before the new mapping stops feeling wrong. Scramble again. Does re-learning get faster?
3. On [Motion Filter](https://fourms.github.io/omo/apps/motion-filter/), play each of the four mappings for one minute. Which is an *instrument* and which is a *demo*? Defend your answer using the coupling/mapping distinction.
4. With three people on [Firefly](https://fourms.github.io/omo/apps/firefly/), start at different tempos and stay silent. How long until Lock % exceeds 80? Now try to *resist* entrainment. Can you?
5. In [Synth Tour](https://fourms.github.io/omo/apps/synth-tour/), find the pad position where FM and Ring mod sound most alike, and most different. What does that tell you about their spectra?

## Explore further

- [Micromotion & Sonification](Micromotion-and-Sonification) — the standstill workshop and inverse mappings.
- [Workshop guide](Workshop-Guide) — facilitator scripts.
- [Sensing Sound and Music](https://fourms.github.io/sensingsoundandmusic/) — the textbook these pages lean on.
