These apps coordinate **acoustically** or via **shared URLs** — not WebRTC (yet; see [Ideas](../IDEAS.md)).

## Conductor

**URL:** `apps/conductor/`

1. Facilitator sets **BPM**, taps **Start 5s countdown**.
2. Musician link is generated with `?start=<unix_ms>&bpm=<n>`.
3. Share via built-in **QR** on the conductor page or the header **QR** in any app.
4. Musicians open the link before “Go!” — downbeat beep at `start`.

Best for: starting a piece together; rough tempo agreement.

## Firefly

**URL:** `apps/firefly/`

- Each phone plays a steady **click**.
- **Mic** listens for neighbouring clicks.
- **Rate** and **phase** slowly adjust (PLL-style entrainment).
- Readouts: playing BPM, lock %, phase error.

Best for: rhythm circles; 10–30 phones; moderate volume inward.

Tips:

- Disable **Listen** if playing solo.
- Own clicks are ignored briefly after each pulse.

## Harmonizer

**URL:** `apps/harmonizer/`

- **Mic** builds a **chroma** histogram from many spectral peaks (many phones = many partials).
- Over time, consensus **root** and optional **major triad** emerge.
- **Hold** the circle to play aligned sine tones.

Best for: drone clusters; slow harmonic blending.

Tips:

- Chroma bar graph shows group tonality.
- Avoid covering the mic while holding.

## What sync does *not* do

- Sample-accurate DAW sync across devices.
- Guaranteed lock in noisy rooms or with in-app browsers.
- Replace Conductor for first downbeat — use both: Conductor to start, Firefly to drift together.

## Conductor + Firefly combo

1. Conductor starts piece at 96 BPM.
2. Switch half the group to **Firefly** at 96 BPM starting BPM.
3. Room maintains pulse after downbeat without a metronome leader.
