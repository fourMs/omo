## Recommended browsers

| Platform | Use | Avoid |
|----------|-----|--------|
| iPhone / iPad | **Safari** | In-app browsers (Instagram, Mail, etc.) |
| Android | **Chrome** | Old bundled “Internet” browsers |

Chrome/Firefox/Edge on iOS use WebKit — behaviour is similar to Safari.

## Permissions

| Permission | Used by |
|------------|---------|
| Microphone | Flute, Theremin, Sampler, ML apps, Firefly, Harmonizer, Evo (count-in only) |
| Camera | Bow Phone, Video Sonifier |
| Motion & orientation | Tilt apps, Compass Wah, bells, granular, etc. |

On **iOS 13+**, motion/orientation often needs an explicit allow after a user gesture.

## Audio unlock

Web Audio on iOS starts **suspended** until the user taps. Every app provides **Audio on** in the header; many also unlock on first pad tap.

## Volume & feedback

- iPhone: turn **silent mode off** (hardware switch).
- Workshop: ~70% system volume is a good default.
- **Harmonizer** / **Firefly**: reduce own speaker volume or use headphones to avoid mic locking to yourself.

## PWA / offline

- **Add to Home Screen** (iOS Share menu, Android install prompt) for full-screen.
- Service worker caches hub, shared JS/CSS, and core modules — not every app binary is offline.

## Sensor summary

| Sensor | Android (Chrome) | iPhone (Safari) |
|--------|------------------|-----------------|
| Web Audio | Good | Unlock on tap |
| Accelerometer | Usually automatic | Tap to allow |
| Compass heading | Often available | iOS 13+ permission |
| Camera / mic | Prompt | Prompt |

## Larger UI

On the hub, enable **Larger UI** for bigger touch targets (`html.omo-a11y`).
