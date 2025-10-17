const CACHE_NAME = "cafe-agora-cache-v1";
const OFFLINE_FILES = [
  "/offline.html",
  "/css/offline.css",
  "/assets/icon-192x192.png",
  "/assets/icon-512x512.png",
  "/assets/img/logoCoffee.png"
];

// Instalación: cachea los archivos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(OFFLINE_FILES);
    })
  );
  console.log("✅ Service Worker instalado (solo offline)");
});

// Activación: limpia caches antiguas si fuera necesario
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  console.log("✅ Service Worker activado");
});

// Fetch: sirve desde cache o red, fallback a offline.html si es navegación
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // 1️⃣ Si está en cache, devuelve el archivo
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2️⃣ Si no está en cache, intenta la red
      return fetch(event.request).catch(() => {
        // 3️⃣ Si es navegación y no hay internet, devuelve offline.html
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      });
    })
  );
});
