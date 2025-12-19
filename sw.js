// TEMP DISABLED SERVICE WORKER (no cache, no await issues)
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());
self.addEventListener("fetch", () => {});
