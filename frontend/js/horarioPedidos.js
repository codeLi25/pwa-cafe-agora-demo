// Campo hora pickup
function generarOpcionesHorario(minHora = 8, maxHora = 21, intervalo = 15) {
  const selectHora = document.getElementById("hora-recogida");
  selectHora.innerHTML = "";

  for (let h = minHora; h <= maxHora; h++) {
    for (let m = 0; m < 60; m += intervalo) {
      if (h === maxHora && m > 0) continue; // Última hora 21:00 exacta
      const horaStr = h.toString().padStart(2, "0");
      const minStr = m.toString().padStart(2, "0");
      const option = document.createElement("option");
      option.value = `${horaStr}:${minStr}`;
      option.textContent = `${horaStr}:${minStr}`;
      selectHora.appendChild(option);
    }
  }
}

// Limitar fecha mínima al día de hoy
const fechaInput = document.getElementById("fecha-recogida");
const hoy = new Date();
fechaInput.min = hoy.toISOString().split("T")[0]; // yyyy-mm-dd

// Ejecutar al cargar el modal o la página
document.addEventListener("DOMContentLoaded", () => {
  generarOpcionesHorario(8, 21, 15);
});
