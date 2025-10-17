const CACHE_NAME = "cafe-agora-cache-v2";
const OFFLINE_FILES = [
  "/offline.html",
  "/css/offline.css",
  "/assets/icon-192x192.png",
  "/assets/icon-512x512.png",
  "/assets/img/logoCoffee.png"
];

// Instalación: cachea los archivos esenciales
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_FILES))
  );
  console.log("✅ Service Worker instalado (solo offline)");
});

// Activación: limpia caches antiguas si existe alguna
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => 
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  console.log("✅ Service Worker activado");
});

// Fetch: cache primero, luego red, fallback a offline.html
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // Devuelve desde cache si existe
      }

      return fetch(event.request)
        .then((networkResponse) => {
          // Guarda dinámicamente en cache cualquier recurso
          return caches.open(CACHE_NAME).then((cache) => {
            // Ignora los request de data cross-origin si quieres
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          // Si es navegación y no hay internet, devuelve offline.html
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        });
    })
  );
});
