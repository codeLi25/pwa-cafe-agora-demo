document.addEventListener("DOMContentLoaded", () => {
  const reservationForm = document.getElementById("reservation-form");
  if (!reservationForm) return;

  // Bloquear días pasados
  const dateInput = reservationForm.querySelector('input[name="date"]');
  const hoy = new Date();
  dateInput.min = hoy.toISOString().split("T")[0];

  // Mesas y horarios
  const mesasDisponibles = [
    { id: 1, capacidad: 2 },
    { id: 2, capacidad: 2 },
    { id: 3, capacidad: 4 }
  ];

  const horarios = [];
  for (let h = 8; h <= 21; h++) {
    horarios.push(`${h.toString().padStart(2, "0")}:00`);
    horarios.push(`${h.toString().padStart(2, "0")}:30`);
  }
  horarios.push("22:00");

  // Inicializar selects
  const peopleSelect = document.getElementById("people");
  for (let i = 1; i <= 12; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i === 1 ? "1 persona" : `${i} personas`;
    peopleSelect.appendChild(option);
  }
  const timeSelect = document.getElementById("time");
  horarios.forEach(h => {
    const option = document.createElement("option");
    option.value = h;
    option.textContent = h;
    timeSelect.appendChild(option);
  });

  // Función para verificar sesión
  function verificarSesion() {
    try {
      const token = localStorage.getItem("token");
      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (token && usuario && usuario.email) return usuario;
      return null;
    } catch {
      return null;
    }
  }

  // Obtener reservas globales
  function obtenerReservasGlobales() {
    return JSON.parse(localStorage.getItem("reservasGlobales")) || [];
  }

  function guardarReservaGlobal(reserva) {
    const reservas = obtenerReservasGlobales();
    reservas.push(reserva);
    localStorage.setItem("reservasGlobales", JSON.stringify(reservas));
  }

  function verificarDisponibilidad(fecha, hora, personas) {
    const reservas = obtenerReservasGlobales();
    const reservasHora = reservas.filter(r => r.fecha === fecha && r.hora === hora);
    let mesasLibres = [...mesasDisponibles];
    reservasHora.forEach(r => {
      const index = mesasLibres.findIndex(m => m.id === r.mesaId);
      if (index !== -1) mesasLibres.splice(index, 1);
    });
    for (let m of mesasLibres) {
      if (personas <= m.capacidad) return m;
    }
    return null;
  }

  // Enviar formulario
  reservationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = verificarSesion();
    if (!usuario) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }

    const formData = new FormData(reservationForm);
    const fecha = formData.get("date");
    const hora = formData.get("time");
    const personas = parseInt(formData.get("people"));
    const tipo = formData.get("reservation_type");
    const telefono = formData.get("phone");
    const mensaje = formData.get("message");

    if (!fecha || !hora || !personas || !tipo || !telefono) {
      alert("Completa todos los campos.");
      return;
    }

    const fechaSeleccionada = new Date(`${fecha}T${hora}:00`);
    if (fechaSeleccionada < new Date()) {
      alert("La fecha y hora seleccionadas ya pasaron. Elige una futura.");
      return;
    }

    const mesa = verificarDisponibilidad(fecha, hora, personas);
    if (!mesa) {
      alert(`No hay mesas disponibles para ${personas} personas a las ${hora}.`);
      return;
    }

    const reserva = {
      id: Date.now(),
      usuario: usuario.email,
      fecha,
      hora,
      personas,
      tipo,
      telefono,
      mensaje,
      mesaId: mesa.id
    };

    guardarReservaGlobal(reserva);
    const reservasUsuario = JSON.parse(localStorage.getItem(`reservas_${usuario.email}`)) || [];
    reservasUsuario.push(reserva);
    localStorage.setItem(`reservas_${usuario.email}`, JSON.stringify(reservasUsuario));

    alert("✅ Reserva realizada con éxito.");
    reservationForm.reset();
    window.location.href = "usuario.html";
  });
});
