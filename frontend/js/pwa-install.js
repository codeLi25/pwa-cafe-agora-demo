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

// 🔹 Ajuste automático del desplazamiento del banner
function actualizarAlturaBanner() {
    const banner = document.querySelector(".pwa-banner");
    if (!banner) return;

    // Obtiene la altura visible real (incluso con padding)
    const altura = banner.classList.contains("hidden") ? 0 : banner.offsetHeight;

    // Aplica la altura como variable CSS global
    document.documentElement.style.setProperty("--banner-height", `${altura}px`);
}

// Llamar al cargar la página
window.addEventListener("load", actualizarAlturaBanner);

// Llamar cada vez que se muestra u oculta el banner
const observer = new MutationObserver(actualizarAlturaBanner);
observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });

// También escuchar cambios de tamaño (por si el banner se adapta en responsive)
window.addEventListener("resize", actualizarAlturaBanner);
