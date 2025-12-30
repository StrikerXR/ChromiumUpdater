const CACHE_NAME = 'chromium-tracker-v2';
const ASSETS = [
  '/',
  'index.html',
  'style.css',
  'theme.css',
  'script.js',
  'manifest.json'
];

// On install, cache the static assets.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

// On activation, remove old caches.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all open clients.
  self.clients.claim();
});

// On fetch, use a network-first strategy.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    // Try to fetch the resource from the network.
    fetch(event.request)
      .then((networkResponse) => {
        // If the fetch is successful, clone the response, cache it, and return it.
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // If the network fetch fails, try to get the resource from the cache.
        return caches.match(event.request);
      })
  );
});
