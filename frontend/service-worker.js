self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("cafe-agora-cache").then(cache => {
      return cache.addAll([
        "./",
        "./index.html",
        "./login.html",
        "./register.html",
        "./usuario.html",
        "./manifest.json",
        "./css/",
        "./js/"
      ]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
