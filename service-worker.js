const cacheName = 'ck-blog-cache-v2';
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => cache.addAll([
      '/js/font.min.js',
      '/js/custom.js',
      '/js/cusdis/cusdis.min.js',
      '/js/cusdis/iframe.umd.js',
      '/images/favicon-16x16.png',
      '/images/favicon-32x32.png',
      '/images/favicon-512x512.png',
      '/manifest.webmanifest'
    ])),
  );
});


function removeCache() {
  caches.keys().then((keyList)=> {
    return Promise.all(keyList.map(function(key) {
        if (key !== cacheName) {
          return caches.delete(key);
        }
    }));
  });
}
removeCache();

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request)),
  );
});