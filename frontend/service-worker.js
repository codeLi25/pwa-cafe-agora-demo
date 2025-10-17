self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("cafe-agora-cache-v1").then((cache) => {
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
  console.log("✅ Service Worker instalado (solo offline)");
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request) // intenta la red primero
      .then((response) => response) // si hay internet, devuelve la página normal
      .catch(() => caches.match("/offline.html")) // si no hay internet, muestra offline.html
  );
});
