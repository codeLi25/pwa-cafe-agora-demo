document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");
  const nombreUsuario = document.getElementById("nombre-usuario");
  const btnLogout = document.getElementById("btn-logout");

  if (!usuario || !token) {
    window.location.href = "login.html";
    return;
  }

  // Mostrar nombre del usuario
  nombreUsuario.textContent = `Hola, ${usuario.nombre}`;

  // Logout
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      const confirmar = confirm("¿Estás seguro de cerrar la sesión?");
      if (confirmar) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        alert("¡Nos vemos! Hasta la próxima 😊");
        window.location.href = "index.html";
      }
    });
  }
});
