const CACHE = "omo-v104";
const ASSETS = [
  "./",
  "./index.html",
  "./support.html",
  "./shared/ui.css",
  "./shared/app.js",
  "./shared/qr.js",
  "./shared/qrcodegen.js",
  "./shared/audio.js",
  "./shared/sensors.js",
  "./shared/compass-rose.js",
  "./shared/hold-play.js",
  "./shared/tilt-amp.js",
  "./shared/hand-bow.js",
  "./shared/motion-express.js",
  "./shared/sound-saber.js",
  "./shared/redirect-to.js",
  "./shared/learn-pedagogy.js",
  "./shared/circular-seq.js",
  "./shared/drum-sounds.js",
  "./shared/evo-pattern.js",
  "./shared/onset-detect.js",
  "./shared/pulse-sync.js",
  "./shared/chroma-detect.js",
  "./shared/harmony-sync.js",
  "./shared/pitch.js",
  "./shared/ml.js",
  "./shared/workshop.js",
  "./shared/hub-catalog.js",
  "./shared/euclidean.js",
  "./shared/markov-melody.js",
  "./shared/lsystem-groove.js",
  "./shared/chaos-params.js",
  "./shared/bit-crush.js",
  "./shared/shepard.js",
  "./shared/clix-engine.js",
  "./shared/crystalis-engine.js",
  "./shared/evo-soundscape.js",
  "./shared/ks.js",
  "./shared/bowed-string.js",
  "./manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const net = fetch(e.request).then((res) => {
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(e.request, clone));
        }
        return res;
      });
      return cached || net;
    })
  );
});
