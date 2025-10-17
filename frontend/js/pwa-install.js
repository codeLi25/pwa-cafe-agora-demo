let deferredPrompt;
const banner = document.getElementById("pwa-install-banner");
const installBtn = document.getElementById("btn-install");
const closeBtn = document.getElementById("btn-close-banner");

// Capturar el evento antes de que se muestre el banner
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // Mostrar el banner solo si hay conexión
  if (navigator.onLine) {
    banner.classList.remove("hidden");
    document.body.classList.add("banner-visible");
  }
});

// Botón "Instalar"
installBtn.addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    console.log("✅ Café Ágora instalada correctamente");
  } else {
    console.log("❌ Instalación cancelada por el usuario");
  }

  banner.classList.add("hidden");
  document.body.classList.remove("banner-visible");
  deferredPrompt = null;
});

// Botón "Cerrar" del banner
closeBtn.addEventListener("click", () => {
  banner.classList.add("hidden");
  document.body.classList.remove("banner-visible");
});

// Opcional: si el usuario recupera conexión, volver a mostrar el banner
window.addEventListener("online", () => {
  if (deferredPrompt) {
    banner.classList.remove("hidden");
    document.body.classList.add("banner-visible");
  }
});
