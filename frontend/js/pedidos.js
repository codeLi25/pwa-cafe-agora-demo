document.addEventListener("DOMContentLoaded", () => {
  const listaPedidos = document.getElementById("lista-pedidos");

  // Verificar sesión del usuario
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  if (!usuario || !token) {
    alert("Debes iniciar sesión para ver tus pedidos.");
    window.location.href = "login.html";
    return;
  }

  // Cargar pedidos solo del usuario actual
  let pedidos = JSON.parse(localStorage.getItem(`pedidos_${usuario.email}`)) || [];

  const ahora = new Date();

  // Filtrar pedidos que aún no han expirado
  pedidos = pedidos.filter(pedido => {
    const fechaHoraRecogida = new Date(`${pedido.fechaRecogida} ${pedido.horaRecogida}`);
    return fechaHoraRecogida > ahora;
  });

  // Actualizar storage del usuario (elimina expirados)
  localStorage.setItem(`pedidos_${usuario.email}`, JSON.stringify(pedidos));

  if (pedidos.length === 0) {
    listaPedidos.innerHTML = `<p class="sin-pedidos">Aún no tienes pedidos realizados.</p>`;
    return;
  }

  // Crear las cards con contador
  listaPedidos.innerHTML = pedidos.map((pedido, i) => `
    <div class="pedido-card" id="pedido-${i}">
      <div class="pedido-header">
        <h3>Pedido del ${pedido.fechaPedido}</h3>
        <p class="contador" id="contador-${i}"></p>
      </div>
      <p><strong>Recoger:</strong> ${pedido.fechaRecogida} - ${pedido.horaRecogida}</p>
      <p><strong>Método de pago:</strong> ${pedido.metodoPago}</p>
      <p><strong>Total:</strong> S/ ${pedido.total}</p>
      <ul>
        ${pedido.carrito.map(p => `<li>${p.nombre} x${p.cantidad} — S/ ${(p.precio * p.cantidad).toFixed(2)}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  // === CONTADOR EN TIEMPO REAL ===
  pedidos.forEach((pedido, i) => {
    const fechaObjetivo = new Date(`${pedido.fechaRecogida} ${pedido.horaRecogida}`);
    const contadorEl = document.getElementById(`contador-${i}`);

    const interval = setInterval(() => {
      const ahora = new Date();
      const distancia = fechaObjetivo - ahora;

      if (distancia <= 0) {
        clearInterval(interval);
        document.getElementById(`pedido-${i}`).remove();

        // Actualizar storage si el tiempo expiró
        pedidos.splice(i, 1);
        localStorage.setItem(`pedidos_${usuario.email}`, JSON.stringify(pedidos));

        if (pedidos.length === 0) {
          listaPedidos.innerHTML = `<p class="sin-pedidos">Aún no tienes pedidos realizados.</p>`;
        }
        return;
      }

      const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

      contadorEl.textContent = ` ${dias}d ${horas}h ${minutos}m ${segundos}s`;
    }, 1000);
  });
});
