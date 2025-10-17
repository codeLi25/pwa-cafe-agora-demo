self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("cafe-agora-cache-v1").then((cache) => {
      return cache.addAll([
        "/",
        "/index.html",
        "/css/estilos.css",
        "/js/pwa-install.js",
        "/manifest.json",
        "/assets/icon-192x192.png",
        "/assets/icon-512x512.png"
      ]);
    })
  );
  console.log("✅ Service Worker instalado (Café Ágora)");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
