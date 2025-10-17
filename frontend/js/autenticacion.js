document.addEventListener("DOMContentLoaded", () => {
  const navActions = document.querySelector(".nav-actions");
  const navLinks = document.querySelector(".nav-links"); // aquí está el menú principal

  // Traer token y usuario de localStorage
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (token && usuario) {
    // ✅ Agregar el enlace "Historial" al menú si no existe aún
    if (!document.getElementById("link-historial")) {
      const li = document.createElement("li");
      li.classList.add("nav-item");
      li.innerHTML = `<a id="link-historial" class="nav-link" href="usuario.html">Historial</a>`;
      navLinks.appendChild(li);
    }

    // ✅ Cambiar los botones de la parte derecha
    navActions.innerHTML = `
      <span class="me-2">Hola, ${usuario.nombre}</span>
      <button id="btn-logout" class="btn btn-outline-danger">Cerrar sesión</button>
    `;

    // 🔘 Cerrar sesión
    const btnLogout = document.getElementById("btn-logout");
    btnLogout.addEventListener("click", () => {
      const confirmar = confirm("¿Estás seguro de cerrar la sesión?");
      if (confirmar) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        alert("¡Nos vemos! Hasta la próxima 😊");
        window.location.href = "index.html";
      }
    });

  } else {
    // ❌ Usuario no logueado: mostrar botones originales
    navActions.innerHTML = `
      <a href="#menu" class="cta-btn">¡Haz tu pedido ya!</a>
      <a href="login.html" class="btn-login">Iniciar sesión</a>
    `;

    // (opcional) Si existe el enlace "Historial", lo quitamos
    const historialLink = document.getElementById("link-historial");
    if (historialLink) historialLink.parentElement.remove();
  }
});
