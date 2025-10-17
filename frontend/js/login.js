const loginForm = document.getElementById("loginForm");
const spinner = document.getElementById("spinner");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  spinner.style.display = "flex";

  try {
    const [res] = await Promise.all([
      fetch("/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }),
      new Promise(resolve => setTimeout(resolve, 2000)) 
    ]);

    const data = await res.json();

    spinner.style.display = "none";

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify({
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido || "",
        email: data.usuario.email
      }));
      window.location.href = "index.html";
    } else {
      alert(data.msg || "Error en login");
    }

  } catch (err) {
    spinner.style.display = "none";
    console.error(err);
    alert("Error al conectar con el servidor");
  }
});
