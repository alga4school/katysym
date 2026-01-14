const CACHE_NAME = "katysym-v6";

const ASSETS = [
  "/katysym/",
  "/katysym/index.html",
  "/katysym/style.css",
  "/katysym/app.js",
  "/katysym/students.js",

  // ✅ Біз manifest.json емес, site.webmanifest қолданамыз
  "/katysym/favicon_io/site.webmanifest",

  // ✅ Иконкалар (сенің папкаңдағы нақты аттар)
  "/katysym/favicon_io/icon-192.png",
  "/katysym/favicon_io/icon-512.png",
  "/katysym/favicon_io/apple-touch-icon.png",

  // ✅ favicon-дар (қаласаң қалдыр)
  "/katysym/favicon_io/favicon-32x32.png",
  "/katysym/favicon_io/favicon-16x16.png",
  "/katysym/favicon_io/favicon.ico"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((resp) => {
          // тек сәтті жауаптарды ғана кэшке салайық
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return resp;
        })
        .catch(() => caches.match("/katysym/index.html"))
    })
  );
});

