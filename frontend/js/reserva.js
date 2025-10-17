document.addEventListener("DOMContentLoaded", () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  if (!usuario || !token) {
    alert("Debes iniciar sesión para ver tus reservas.");
    window.location.href = "login.html";
    return;
  }

  const listaReservas = document.getElementById("lista-reservas");
  if (!listaReservas) return;

  let reservas = JSON.parse(localStorage.getItem(`reservas_${usuario.email}`)) || [];

  if (reservas.length === 0) {
    listaReservas.innerHTML = '<p class="sin-pedidos"> No tienes reservas.</p>';
    return;
  }

  listaReservas.innerHTML = "";

  reservas.forEach((r, index) => {
    const div = document.createElement("div");
    div.className = "reserva-item";

    div.innerHTML = `
      <p><strong>Fecha:</strong> ${r.fecha}</p>
      <p><strong>Hora:</strong> ${r.hora}</p>
      <p><strong>Personas:</strong> ${r.personas}</p>
      <p><strong>Tipo de reserva:</strong> ${r.tipo}</p>
      <p><strong>Teléfono:</strong> ${r.telefono}</p>
      <p><strong>Mensaje:</strong>${r.mensaje || "-"}</p>
      <p><strong>Mesa asignada:</strong>${r.mesaId}</p>
    `;

    const timerSpan = document.createElement("span");
    timerSpan.className = "reserva-timer";
    div.appendChild(timerSpan);

    const fechaHoraReserva = new Date(`${r.fecha}T${r.hora}:00`);
    const fechaExpira = new Date(fechaHoraReserva.getTime() + 2 * 60 * 60 * 1000);

    function actualizarContador() {
      const ahora = new Date();
      let diff = Math.floor((fechaExpira - ahora) / 1000);

      if (diff <= 0) {
        clearInterval(intervalo);
        div.remove();
        reservas.splice(index, 1);
        localStorage.setItem(`reservas_${usuario.email}`, JSON.stringify(reservas));
        if (reservas.length === 0) {
          listaReservas.innerHTML = "<p>No tienes reservas.</p>";
        }
        return;
      }

      const horas = Math.floor(diff / 3600);
      diff %= 3600;
      const minutos = Math.floor(diff / 60);
      const segundos = diff % 60;

      timerSpan.textContent = `Faltan ${horas} h, ${minutos} min, ${segundos} s`;
    }

    actualizarContador();
    const intervalo = setInterval(actualizarContador, 1000);

    listaReservas.appendChild(div);
  });
});
