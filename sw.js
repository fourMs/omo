const CACHE = "omo-v120";
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
  "./shared/stillness.js",
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
  const isDoc = e.request.mode === "navigate" || e.request.destination === "document";
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      // Match only the current versioned cache — never mix files from an
      // older deploy with a newer one (a page + shared-module skew can kill
      // an app at module load).
      const cached = await c.match(e.request);
      const net = fetch(e.request).then((res) => {
        if (res.ok && e.request.url.startsWith(self.location.origin)) {
          c.put(e.request, res.clone());
        }
        return res;
      });
      // Pages: network-first so updates arrive on the next load; cache is
      // the offline fallback. Assets: cache-first for speed.
      if (isDoc) return net.catch(() => cached || Response.error());
      return cached || net;
    })
  );
});
