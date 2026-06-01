# Ensemble sync

OMO performs **without a central audio server**. Timing is social and acoustic: players listen, watch, and use a few apps that share **URLs** or **local entrainment**.

## Conductor

[Conductor](https://fourms.github.io/omo/apps/conductor/) provides:

- Adjustable **BPM**
- **Countdown** before a shared downbeat
- A **shareable URL** (QR in header) so others open the same start time

Limitation: each phone schedules locally. Expect roughly **50–100 ms** jitter between devices on the same Wi‑Fi — fine for workshops, noticeable for tight studio grid.

### Facilitator flow

1. Conductor sets BPM and taps **Start countdown**.
2. Everyone with the shared link hears/ sees the same count-in.
3. Rhythm apps (sequencers, Firefly) start on the downbeat by ear.

## Firefly

[Firefly](https://fourms.github.io/omo/apps/firefly/) plays a pulse click and **listens** for onsets in the room (mic). It slowly **pulls** its internal phase toward heard attacks — firefly-style entrainment.

- Good for **pulse / time** roles when Conductor links are awkward.
- Works best when players can hear neighbours' speakers.
- Visual flash on each pulse helps silent sections.

## Harmonizer

[Harmonizer](https://fourms.github.io/omo/apps/harmonizer/) tracks **chroma** from the mic and drives detuned drone voices.

- Assign different roots across the drone row (**Just Equal**, **Heading Choir**, **Harmonizer**).
- Not sample-accurate MIDI sync — harmonic **following** rather than beat clock.

## Swarm Bloom

[Swarm Bloom](https://fourms.github.io/omo/apps/swarm-bloom/) combines evolving drones with ensemble-oriented rhythm — mic and group behaviour; use sparingly with large groups.

## Kaoss Pad & sequencers

**Kaoss Pad** (Lead / Beat programs) and grid sequencers (**Drum Sequencer**, **Circular Drum**, **Euclidean Rings**) run on **local clocks**. Align by:

- Starting on Conductor downbeat, or
- Muting until the facilitator cues a layer.

## What we do not ship (yet)

- No WebRTC room or NTP clock in the current repo.
- No Ableton Link — all sync is acoustic / URL-based.

For workshop planning, see [Workshop guide](Workshop-Guide) → Ensemble (15 min).
