# Browsers & hardware

OMO apps use the Web Audio API and browser sensor APIs. There is no native app store build; performance depends on the browser and OS.

## Recommended browsers

| Platform | Browser | Notes |
|----------|---------|--------|
| iPhone / iPad | Safari | Best Web Audio + motion unlock flow |
| Android | Chrome | Stable mic and motion |
| Desktop (testing) | Chrome / Firefox / Safari | Useful for development; not typical on stage |

Avoid in-app browsers (Instagram, Messenger, email). Use Open in Safari/Chrome from the share sheet.

## Audio unlock (iOS)

1. Tap Audio on in the header after the page loads.
2. Touch the play surface once if oscillators stay silent.
3. Disable the hardware mute switch; set media volume to ≥ 70%.
4. Add to Home Screen for a more stable full-screen session (optional PWA).

## Sensors

| Sensor | Typical use | iOS Safari | Android Chrome |
|--------|-------------|------------|----------------|
| Touch / multi-touch | All instruments | Yes | Yes |
| Microphone | Firefly, Harmonizer, ML apps | Prompt | Prompt |
| Device motion (tilt) | Motion Filter, Standstill, Shepard, granular | After gesture + permission | Usually yes |
| Compass | Compass Wah (Wah + Choir modes) | Yes (permission) | Varies |
| Camera | Shadow Sequencer, Video Sonifier, Bow Phone | Prompt | Prompt |

Run [Device support](https://fourms.github.io/omo/support.html) before a workshop to see which APIs this device exposes.

### Motion permission (iPhone and iPad)

iOS only exposes motion sensors after an explicit tap and an Allow in a per-site dialog. On current iOS there is no motion toggle in Settings; everything happens in that dialog.

1. Open the app in Safari itself, not inside Instagram, Messenger, or an e-mail app. In-app browsers often never show the dialog; use Open in Safari from the share sheet.
2. Tap the play surface once. Safari asks: "fourms.github.io" Would Like to Access Motion and Orientation.
3. Tap Allow. The app then calibrates; hold the phone still until it finishes.

If the dialog never appears, or someone tapped Cancel:

- Reload the page (pull down, or the reload button) and tap the surface again. Safari refuses to re-ask until the page is reloaded — this is the fix for nearly every stuck phone in a workshop.
- Still nothing: close the tab completely and open the link fresh, for example by scanning the QR code again.
- Chrome and Firefox on iOS run on Safari's engine, so the same steps apply; if they misbehave, plain Safari is the reliable path.
- Lockdown Mode (Settings → Privacy & Security) blocks browser motion sensors entirely.
- Very old devices (iOS 12) have no dialog; there, enable Settings → Safari → Motion & Orientation Access.

## Volume & acoustics

- Phones are the only loudspeakers in typical OMO rules: position bodies so listeners hear the ensemble, not only their own speaker.
- In noisy rooms, favour drones and sequencers over quiet mic-tracking apps.
- [Firefly](https://fourms.github.io/omo/apps/firefly/) and [Conductor](https://fourms.github.io/omo/apps/conductor/) work best when the group can hear each other's pulses.

## Offline use

The site registers a service worker (`sw.js`) that caches the hub, shared scripts, and core assets. After one online visit, many apps work offline; new app versions bump the cache name (e.g. `omo-v98`); reload once if behaviour looks stale.

## Hardware quirks

- [Motion Filter](https://fourms.github.io/omo/apps/motion-filter/) folder: `apps/motion-filter/` (legacy `motion-wah`, `shake-filter`, `flat-edge`, `filter-ladder` redirect there).
- Older KS Pluck URLs redirect to [KS String](https://fourms.github.io/omo/apps/ks-string/).
- Retired hub apps may still exist as redirect stubs: see [App catalog](App-Catalog) → Retired.
