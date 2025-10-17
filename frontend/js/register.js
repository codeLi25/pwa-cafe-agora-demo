const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!nombre || !apellido || !email || !password) {
    alert("Todos los campos son obligatorios");
    return;
  }

  try {
    const res = await fetch("/api/usuarios/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, apellido, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      alert("Registro exitoso! Ahora puedes iniciar sesión.");
      window.location.href = "login.html"; // redirigir al login
    } else {
      alert(data.mensaje || "Error en registro");
    }
  } catch (err) {
    console.error(err);
    alert("Error al conectar con el servidor");
  }
});
