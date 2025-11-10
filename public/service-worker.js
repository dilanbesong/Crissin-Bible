

const CACHE_NAME = "bible-app-cache-v1";

// List of routes and assets to cache
const ASSETS_TO_CACHE = ['/','/bible', '../' ];

// Install event - Cache assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Pre-caching app routes...");
      return cache.addAll(ASSETS_TO_CACHE);qqqqqqqqqq
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
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((response) => {
          if (
            !response ||
            response.status !== 200 ||
            response.type === "opaque"
          ) {
            return response;
          }

          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Automatically cache assets (js, css, images)
            if (
              event.request.url.match(/\.(js|css|html|png|jpg|jpeg|svg|ico)$/)
            ) {
              cache.put(event.request, clonedResponse);
            }
          });

          return response;
        })
        .catch(() => caches.match("/index.html"));
    })
  );
});

