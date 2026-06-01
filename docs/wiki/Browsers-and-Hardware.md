# Browsers & hardware

OMO apps use the **Web Audio API** and browser sensor APIs. There is no native app store build — performance depends on the browser and OS.

## Recommended browsers

| Platform | Browser | Notes |
|----------|---------|--------|
| iPhone / iPad | **Safari** | Best Web Audio + motion unlock flow |
| Android | **Chrome** | Stable mic and motion |
| Desktop (testing) | Chrome / Firefox / Safari | Useful for development; not typical on stage |

**Avoid in-app browsers** (Instagram, Messenger, email). Use **Open in Safari/Chrome** from the share sheet.

## Audio unlock (iOS)

1. Tap **Audio on** in the header after the page loads.
2. Touch the play surface once if oscillators stay silent.
3. Disable the hardware mute switch; set media volume to **≥ 70%**.
4. **Add to Home Screen** for a more stable full-screen session (optional PWA).

## Sensors

| Sensor | Typical use | iOS Safari | Android Chrome |
|--------|-------------|------------|----------------|
| Touch / multi-touch | All instruments | Yes | Yes |
| Microphone | Firefly, Harmonizer, ML apps | Prompt | Prompt |
| Device motion (tilt) | Motion Trump, Shepard, granular | After gesture + permission | Usually yes |
| Compass | Compass Wah, Heading Choir | Yes (permission) | Varies |
| Camera | Shadow Sequencer, Video Sonifier, Bow Phone | Prompt | Prompt |

Run **[Device support](https://fourms.github.io/omo/support.html)** before a workshop to see which APIs this device exposes.

### Motion permission (iOS 13+)

Motion often stays flat until the user interacts and grants access. In workshops:

1. Open any motion app.
2. Tap the pad, then allow motion when prompted.
3. If still flat: Settings → Safari → **Motion & Orientation** → allow.

## Volume & acoustics

- Phones are the **only** loudspeakers in typical OMO rules — position bodies so listeners hear the ensemble, not only their own speaker.
- In noisy rooms, favour drones and sequencers over quiet mic-tracking apps.
- **Firefly** and **Conductor** work best when the group can hear each other's pulses.

## Offline use

The site registers a **service worker** (`sw.js`) that caches the hub, shared scripts, and core assets. After one online visit, many apps work offline; new app versions bump the cache name (e.g. `omo-v98`) — reload once if behaviour looks stale.

## Hardware quirks

- **Motion Trump** folder: `apps/motion-wah/` (title on hub: Motion Trump).
- Older **KS Pluck** URLs redirect to **KS String**.
- Retired hub apps may still exist as redirect stubs — see [App catalog](App-Catalog) → Retired.
