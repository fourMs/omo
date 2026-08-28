# Micromotion & Sonification

Companion page for the standstill workshop: two OMO instruments, [Standstill](https://fourms.github.io/omo/apps/standstill/) and [Micromotion](https://fourms.github.io/omo/apps/micromotion/), invert the usual logic of a musical instrument. Sound appears when you stop moving, and what you then hear is the motion you cannot suppress. This page explains the research behind them, the sonification principles they follow, and a workshop script.

## Still is never still

Micromotion is the tiny involuntary movement, at millimetre scale, that remains when a person tries to stand completely still: balance corrections, breathing, heartbeat. It is hard to study music-related movement directly, because people stop moving as soon as they notice they are being watched. The standstill paradigm inverts the task: ask people to stand *as still as they possibly can*, and measure what is left.

The Norwegian Championship of Standstill (run at UiO since 2012) does exactly this: participants stand still for six minutes while motion capture records a head marker; the competitive framing removes any suspicion that people are moving because they cannot be bothered not to. The results are consistent: nobody manages to be still. In one study of 91 participants, average head speed was around 6.5 mm/s, and slightly but reliably *higher* with music playing than in silence. Two takeaways: the scale (millimetres per second, nothing you would see in a video), and the direction (music moves you even when you are instructed not to move).

The two apps put this finding in your hands. Hold the phone against your chest, stand still, and the sound that blooms is being steered by motion you cannot see or stop.

## Sonification: letting data sound

Sonification is the use of non-speech sound to convey information, the auditory sibling of visualisation. Interactive sonification closes the loop: the data being sounded is *your own*, live, so perception and action chase each other in real time (the book's action–perception loop, running through a loudspeaker).

The apps follow the sonification design of the Oslo Standstill Database front end, which rests on a few principles worth teaching in their own right:

| what the body does | what is heard | why |
|---|---|---|
| overall quantity of motion | the gate: stillness opens it, movement closes it | the *inverse* mapping, the workshop's premise |
| residual micromotion | brightness (a filter opening, 300–1200 Hz) | graded and perceptually smooth |
| slow sway direction | stereo position | direct crossmodal correspondence |
| sustained stillness | new voices join (a bloom) | rewards what the task asks for |

Two deliberate refusals:

- Pitch is never used for motion amount. Pitch is the strongest perceptual dimension we have; mapping millimetres per second onto it would make small differences sound enormous, misrepresenting the central finding, that still bodies are *nearly alike*. Brightness carries the data instead.
- Steps are never audible. Every parameter moves by ramps, on a log scale, so equal *ratios* of motion give equal perceptual steps. Sonification that clicks and staircases is sonifying its own sample rate, not the body.

Quantity of motion (QoM), a single summary number for how much movement occurs, is the workhorse measure here, as in the research. The apps compute it from the accelerometer and show it inverted as the *Still %* readout.

## What a phone can and cannot measure

A motion-capture system measures position; your phone measures acceleration and (with a gyroscope) rotation rate. You cannot recover a wander path from acceleration alone, and a head- or chest-worn accelerometer also picks up *orientation*: comparing devices on the same body, accelerometer-based QoM reads roughly 2.5× higher than an optical marker, with tilt alone inflating it about 2.3×. So the apps never claim millimetres per second; they show a normalised stillness score instead. Honest units are part of honest sonification.

A closer look: the markers that would not stand still. In the standstill research, reflective markers placed on *stands* appeared to "respond" to music, until the explanation turned out to be the measurement chain's own noise floor plus floor vibration from the loudspeakers. The human results survive because they sit well above that floor; the marker "results" do not. The lesson: *before trusting a small effect, measure something dead alongside something living.* This is why both apps begin with a 2-second calibration: they learn your phone's noise floor while you hold still, so that sensor noise is not mistaken for your body. (Recalibrate after changing grip; phones differ a lot.)

The [Micromotion](https://fourms.github.io/omo/apps/micromotion/) app adds the decomposition: postural sway lives below ~1 Hz, tremor and heartbeat-range jitter around 2–8 Hz, and rotation comes from the gyroscope, estimated from tilt on phones without one; the readout tells you which source you are hearing. Three bands, three voices: you can *listen* your way around your own nervous system.

## The inverse gate is asymmetric

One design detail worth discussing with students: movement silences the sound almost instantly (~0.1 s), but stillness returns it slowly (~1.5 s), and the bloom voices need sustained stillness (10–50 s) to join. The asymmetry is the pedagogy: you can *break* the sound with a flick, but you must *earn* it back with your whole body. It also mirrors how the measurement works: one jerk proves you moved; only time proves you are still.

## Workshop script: the standstill session (30–40 min)

Before: phones on max volume, silent-mode off; open [standstill](https://fourms.github.io/omo/apps/standstill/) via QR. Works on every phone with an accelerometer; no microphone or camera needed.

1. Frame it (3 min). "This instrument is played by not playing it." Explain the inverse mapping and the ~6.5 mm/s finding. Nobody will reach silence-proof stillness; that is the point.
2. Calibrate (2 min). Everyone taps once, holds the phone against the chest, stands still through the calibration ring. Discuss: why does the app need to learn *your* phone first?
3. Solo standstill (5 min). Stand apart, eyes soft. Let the room fill as people settle: the ensemble sound *is* the group's collective stillness. Anyone who moves drops out audibly, so listen for it.
4. Championship (10 min). Run the built-in 60-second Championship in heats. Compare scores; ask the winners what they did with their breathing, their knees, their gaze. (The research suggests strategies: soft knees, distant gaze, slow breath.)
5. Micromotion listening (10 min). Switch to [micromotion](https://fourms.github.io/omo/apps/micromotion/). Explore the three lanes: slow deliberate breathing (watch sway), holding breath (does tremor change?), turning the head only (rotation). Phones without a gyroscope show "tilt estimate"; use it to discuss what accelerometers cannot measure.
6. Discuss (5 min). Where was the music? Is standing still a *sound-producing action*? What did the inverse mapping change about how you attended to your own body?

Variation for larger groups: half the room plays Standstill, half listens with eyes closed and points to where movement happens. Swap.

## Exercises

1. Hold your phone as still as you can on a table, then in your hand, then against your chest. Rank the three Still % readings and explain the differences (noise floor, arm tremor, breathing, heartbeat).
2. In Micromotion, make the *sway* lane rise without the *tremor* lane rising. Then the reverse. Which was harder, and why?
3. The apps refuse to map motion to pitch. Sketch what the Championship would sound like if they didn't, and argue whether a 4% difference in stillness should be *audible as* a 4% difference.
4. A friend claims their phone proves they moved 3 mm during a standstill. Using the accelerometer-vs-position argument above, explain what their phone actually measured.
5. Compare Standstill with Flat gate in [Motion Filter](https://fourms.github.io/omo/apps/motion-filter/?mode=flat): both reward not-moving, but one gates on *pose* and one on *motion*. Shake a phone lying flat to demonstrate the difference.

## Further reading

- *The body* chapter of [Sensing Sound and Music](https://fourms.github.io/sensingsoundandmusic/): micromotion, standstill paradigm, motion capture.
- The [Oslo Standstill Database](https://www.uio.no/ritmo/english/research/labs/fourms/) and its public front end: the sonification design (log-scaled QoM → brightness, ramps not steps) that these instruments reimplement live.
- [Learning with OMO](Learning-with-OMO): coupling vs mapping, and the rest of the collection.
