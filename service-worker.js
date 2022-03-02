const cacheName = 'ck-blog-cache-v12';

async function removeCache() {
  const keyList = await caches.keys()
  return Promise.all(keyList.map((key) => {
    if (key !== cacheName) {
      return caches.delete(key);
    }
  }));
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll([
      '/favicon.ico',
      '/js/font.min.js',
      '/js/custom.js',
      '/js/cusdis/cusdis.min.js',
      '/js/cusdis/iframe.umd.js',
      '/images/favicon-32x32.png',
      '/images/favicon-192x192.png',
      '/images/favicon-512x512.png',
      '/manifest.webmanifest'
    ])),
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(removeCache());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request)),
  );
});