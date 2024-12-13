importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = 'offline-support';

const offlineFallbackPage = 'offline-page.html';
const offlineIcon = 'offline-page.html';

const offlineResources = [
  offlineFallbackPage,
  'favicon.ico',
  'wifi-off.png', // Assuming this is a locally hosted image
  // Add URLs of external resources to cache here
  'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap',
  // Add other URLs of external resources to cache here
];

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(offlineResources);
    }),
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// workbox.routing.registerRoute(
//   new RegExp('/*'),
//   new workbox.strategies.StaleWhileRevalidate({
//     cacheName: CACHE,
//   }),
// );

function logToConsole(message) {
  // Send message to the client page
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'log',
        message: message,
      });
    });
  });
}

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })(),
    );
  } else if (event.request.destination === 'image') {
    if (event.request.url.includes('/wifi-off.png') || event.request.url.includes('favicon.ico')) {
      event.respondWith(
        (async () => {
          const cache = await caches.open(CACHE);
          const cachedResp = await cache.match(event.request.url);
          if (cachedResp) {
            return cachedResp;
          } else {
            return event.request && fetch(event.request);
          }
        })(),
      );
    }
  }
});

self.addEventListener('push', (event) => {});
