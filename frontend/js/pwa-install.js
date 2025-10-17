let deferredPrompt;
const banner = document.getElementById("pwa-install-banner");
const installBtn = document.getElementById("btn-install");
const closeBtn = document.getElementById("btn-close-banner");

// Mostrar el banner cuando el evento esté disponible
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  // 🔹 Mostrar siempre el banner
  banner.classList.remove("hidden");
  document.body.classList.add("banner-visible");
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

// Botón "Cerrar"
closeBtn.addEventListener("click", () => {
  banner.classList.add("hidden");
  document.body.classList.remove("banner-visible");
  // ❌ Ya no usamos localStorage
});


