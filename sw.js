const CACHE_NAME = "katysym-v2";

const ASSETS = [
  "/katysym/",
  "/katysym/index.html",
  "/katysym/style.css",
  "/katysym/app.js",
  "/katysym/students.js",
  "/katysym/manifest.json",
  // мында төменде manifest-тағы нақты иконка жолдарын қой (2-бөлімде айтам)
  "/katysym/favicon_io/android-chrome-192x192.png",
  "/katysym/favicon_io/android-chrome-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
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
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return resp;
        })
        .catch(() => caches.match("/katysym/index.html"));
    })
  );
});
