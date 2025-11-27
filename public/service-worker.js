// --- Service Worker for Reactive Bible PWA ---

// 1. Configuration and Caching Strategy
const CACHE_VERSION = "v1.1.0"; // Increment this version to trigger cache update/cleanup
const CACHE_NAME = `reactive-bible-cache-${CACHE_VERSION}`;

// The App Shell: essential files to cache on install for immediate offline loading
const APP_SHELL_ASSETS = [
  "/", // Main entry point
  "/index.html",
  "/icon.svg", // Mentioned in index.html
  // Add any common fonts, CSS, or bundled data files here if their names are static
];

// 2. Install Event: Pre-cache the App Shell
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installation in progress: Caching App Shell.");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // Attempt to cache all App Shell assets.
        // The .catch() allows the SW to install even if some optional asset fails.
        return Promise.all(
          APP_SHELL_ASSETS.map((url) => {
            return cache.add(url).catch((error) => {
              console.warn(
                `[Service Worker] Failed to cache asset: ${url}`,
                error
              );
            });
          })
        ).then(() => {
          // Immediately activate the new service worker
          return self.skipWaiting();
        });
      })
      .catch((error) => {
        console.error(
          "[Service Worker] Failed to open cache during install:",
          error
        );
      })
  );
});

// 3. Activate Event: Clean up old caches
self.addEventListener("activate", (event) => {
  console.log(
    "[Service Worker] Activation in progress: Cleaning up old caches."
  );
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName.startsWith("reactive-bible-cache-") &&
              cacheName !== CACHE_NAME
            ) {
              console.log(`[Service Worker] Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Ensure the Service Worker takes control of the page immediately
        return self.clients.claim();
      })
  );
});

// 4. Fetch Event: Cache-First Strategy
// This strategy checks the cache first. If found, it returns the cached version.
// If not found, it fetches from the network, caches the response, and returns it.
self.addEventListener("fetch", (event) => {
  // Only handle GET requests for caching logic
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);

  // Skip cross-origin requests for internal caching (e.g., Google Analytics, etc.)
  // If you want to cache external resources like Wordpocket audio, you can remove this check,
  // but ensure the request type is 'basic' or 'cors' and handles Opaque responses.
  if (requestUrl.origin !== location.origin) {
    // For external resources (like the Wordpocket audio), use network-only or cache them
    // only if the response is simple and small. For large audio, avoid aggressive caching.
    return event.respondWith(fetch(event.request));
  }

  // Handle all other requests with a Cache-First approach
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1. Check cache: If found, return the cached version immediately
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Cache miss: Fetch from the network
      return fetch(event.request)
        .then((networkResponse) => {
          // Check if we received a valid response before caching
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // IMPORTANT: Clone the response, as it can only be consumed once
          const responseToCache = networkResponse.clone();

          // Cache the new resource for future use
          caches.open(CACHE_NAME).then((cache) => {
            // Use .put() for caching new/updated resources
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch((error) => {
          console.error(
            "[Service Worker] Fetch failed and no cache available:",
            error
          );
          // If both cache and network fail, fall back to a generic offline response
          return new Response(
            "You appear to be offline. Please check your connection.",
            {
              status: 503,
              statusText: "Service Unavailable",
              headers: new Headers({ "Content-Type": "text/plain" }),
            }
          );
        });
    })
  );
});
