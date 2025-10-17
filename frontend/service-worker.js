self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("cafe-agora-cache-v1").then((cache) => {
      // Solo cacheamos lo necesario para mostrar la página offline
      return cache.addAll([
        "/offline.html",
        "/css/offline.css",
        "/css/nav.css",
        "/assets/icon-192x192.png",
        "/assets/icon-512x512.png",
        "/assets/img/logoCoffee.png"
      ]);
    })
  );
  console.log("✅ Service Worker instalado (offline solo)");
});

// Network First: intenta cargar de la red primero
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si hay internet, devolvemos la respuesta de la red
        return response;
      })
      .catch(() => {
        // Si no hay internet, mostramos offline.html
        return caches.match("/offline.html");
      })
  );
});
