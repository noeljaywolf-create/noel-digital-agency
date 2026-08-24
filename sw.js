const CACHE_NAME = 'noel-digital-v2';
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

  // Only treat real HTML page navigations (site root or *.html) via this handler.
  // We key off the URL (not the Accept header) because browsers send
  // "text/html" in Accept for ALL document navigations, including feed.xml.
  // This prevents non-HTML resources (e.g. feed.xml) from ever falling back
  // to 404.html.
  var isHtmlPage = event.request.mode === 'navigate' &&
    (url.pathname === '/' || /\.html?$/i.test(url.pathname));

  if (isHtmlPage) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return caches.match(event.request).then(function(resp) {
          return resp || caches.match('./404.html');
        });
      })
    );
    return;
  }

  // For other requests (feed.xml, css, js, images, fonts), use cache-first
  // with network fallback. These are never served as HTML.
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
