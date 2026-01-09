// ✅ Каждый раз при обновлении увеличивайте номер версии:
const CACHE_VERSION = "v7";
const CACHE_NAME = `katysym-${CACHE_VERSION}`;

const ASSETS = [
  "/katysym/",
  "/katysym/index.html",
  "/katysym/style.css",
  "/katysym/app.js",
  "/katysym/students.js",

  "/katysym/favicon_io/site.webmanifest",
  "/katysym/favicon_io/icon-192.png",
  "/katysym/favicon_io/icon-512.png",
  "/katysym/favicon_io/apple-touch-icon.png",
  "/katysym/favicon_io/favicon-32x32.png",
  "/katysym/favicon_io/favicon-16x16.png",
  "/katysym/favicon_io/favicon.ico",
];

// Установка: кладём нужные файлы в кэш
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  // ✅ чтобы новая версия SW активировалась сразу
  self.skipWaiting();
});

// Активация: удаляем старые кэши
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key.startsWith("katysym-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  // ✅ сразу начинаем контролировать страницы
  self.clients.claim();
});

// Fetch: HTML лучше брать свежий, остальное можно отдавать из кэша
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Только наш домен/путь
  if (!url.pathname.startsWith("/katysym/")) return;

  // ✅ index.html всегда пытаемся обновить из сети (чтобы не залипало)
  if (url.pathname === "/katysym/" || url.pathname === "/katysym/index.html") {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put("/katysym/index.html", copy));
          return resp;
        })
        .catch(() => caches.match("/katysym/index.html"))
    );
    return;
  }

  // Остальные файлы: cache-first, а при удаче обновляем кэш
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((resp) => {
          if (resp && resp.status === 200) {
            const copy = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return resp;
        })
        .catch(() => caches.match("/katysym/index.html"));
    })
  );
});
