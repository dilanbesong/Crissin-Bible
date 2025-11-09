const CACHE_NAME = "bible-app-cache-v1";

// List of routes and assets to cache
const ASSETS_TO_CACHE = [
  "/",
  "/bible",
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "./styles/LandingPage.css",
  // You can include built JS and CSS files after build
  "/assets/index.js",
  "/assets/index.css",
];

// Install event - Cache assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching app routes...");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event - Clean old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...");
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Serve cached content or fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // For navigation requests (SPA routing)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache a fresh copy
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => {
          // Fallback to cached index.html for offline routing
          return caches.match("/index.html");
        })
    );
    return;
  }

  // For other files (images, JS, CSS)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      // Fetch from network and cache it
      return fetch(request)
        .then((networkResponse) => {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return networkResponse;
        })
        .catch(() => {
          // Optionally, return a fallback (like a placeholder image)
          return caches.match("/index.html");
        });
    })
  );
});
