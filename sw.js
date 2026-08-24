const CACHE_NAME = 'noel-digital-v1';
const ASSETS = [
  './',
  './index.html',
  './about.html',
  './services.html',
  './portfolio.html',
  './process.html',
  './contact.html',
  './roi-calculator.html',
  './404.html',
  './styles.css?v=10',
  './manifest.json',
  './favicon.ico',
  './feed.xml',
  './loggo.png',
  './search-index.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700;800&display=swap'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS).catch(function(err) {
        console.log('SW cache addAll failed:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) {
          return key !== CACHE_NAME;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);

  // For navigation requests (HTML pages), use network-first with cache fallback.
  // Gate on text/html accept so non-HTML resources (e.g. feed.xml) are NOT
  // routed here and never fall back to 404.html.
  if (event.request.mode === 'navigate' &&
      event.request.headers.get('accept') &&
      event.request.headers.get('accept').indexOf('text/html') !== -1) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request).then(function(resp) {
          return resp || caches.match('./404.html');
        });
      })
    );
    return;
  }

  // For other requests, use cache-first with network fallback
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        // Cache successful GET responses
        if (response && response.status === 200 && response.type === 'basic') {
          var cloned = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, cloned);
          });
        }
        return response;
      }).catch(function() {
        // Offline fallback for images
        if (event.request.destination === 'image') {
          return caches.match('./loggo.png');
        }
      });
    })
  );
});
