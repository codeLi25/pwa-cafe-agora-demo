// === CARRITO Y MODAL DE PEDIDO ===

// Referencias
const btnContinuar = document.getElementById("btn-continuar");
const modal = document.getElementById("checkout-modal");
const cerrarModal = document.getElementById("cerrar-modal");
const checkoutForm = document.getElementById("checkout-form");
const metodoPagoSelect = document.getElementById("metodo-pago");
const paymentDetails = document.getElementById("payment-details");
const checkoutSubtotal = document.getElementById("checkout-subtotal");
const checkoutLoading = document.getElementById("checkout-loading");

// 🔹 Helper: calcular total del carrito
function calcularTotalNumber() {
  return carrito.reduce((s, p) => s + p.precio * p.cantidad, 0);
}

// 🔹 Verificar sesión actual (token + usuario)
function verificarSesion() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  return token && usuario;
}

// 🔹 Abrir modal (continuar con pedido)
btnContinuar.addEventListener("click", (e) => {
  e.preventDefault();

  if (!carrito || carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  if (!verificarSesion()) {
    alert("Debes iniciar sesión para continuar con el pedido.");
    localStorage.setItem("bloquearModalPedido", "true");
    window.location.href = "login.html";
    return;
  }

  // ✅ Usuario logueado → abrir modal
  checkoutSubtotal.textContent = "S/ " + calcularTotalNumber().toFixed(2);
  metodoPagoSelect.value = "";
  paymentDetails.innerHTML = "";
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
});

// 🔹 Cerrar modal
cerrarModal.addEventListener("click", () => {
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
});

// 🔹 Bloquear reapertura del modal al volver del login
window.addEventListener("pageshow", () => {
  if (localStorage.getItem("bloquearModalPedido") === "true") {
    modal.style.display = "none";
    localStorage.removeItem("bloquearModalPedido");
  }
});

// 🔹 Cambios en método de pago
metodoPagoSelect.addEventListener("change", (e) => {
  const v = e.target.value;
  paymentDetails.innerHTML = "";

  if (v === "tarjeta") {
    paymentDetails.innerHTML = `
      <label for="card-number">Número de tarjeta</label>
      <input id="card-number" class="input-style card-input" type="text" inputmode="numeric" maxlength="19" placeholder="XXXX XXXX XXXX XXXX" required>
      <div class="payment-row">
        <div class="col">
          <label for="card-exp">Vencimiento</label>
          <input id="card-exp" class="input-style" type="text" maxlength="5" placeholder="MM/AA" required>
        </div>
        <div class="col">
          <label for="card-cvv">CVV</label>
          <input id="card-cvv" class="input-style" type="password" maxlength="3" placeholder="XXX" required>
        </div>
      </div>
      <small style="color:#666; display:block; margin-top:6px;">* Pago simulado. No se procesará tarjeta realmente.</small>
    `;
  } else if (v === "yape") {
    paymentDetails.innerHTML = `
      <div class="yape-info">
        <div>
          <div style="font-size:13px;color:#666">Paga a:</div>
          <div class="yape-num">+51 950 749 175</div>
        </div>
        <div>
          <img src="assets/img/yape-qr.jpg" alt="Yape QR" />
        </div>
      </div>
      <small style="color:#666; display:block; margin-top:6px;">Escanea el QR con Yape/Plin o realiza el pago y confirma.</small>
    `;
  }
});

// 🔹 Envío del formulario (confirmar pedido)
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!verificarSesion()) {
    alert("Debes iniciar sesión para completar el pedido.");
    modal.style.display = "none";
    window.location.href = "login.html";
    return;
  }

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Validar campos
  const nombre = document.getElementById("nombre").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const fechaRecogida = document.getElementById("fecha-recogida").value;
  const horaRecogida = document.getElementById("hora-recogida").value;
  const metodo = metodoPagoSelect.value;

  if (!nombre || !telefono || !fechaRecogida || !horaRecogida || !metodo) {
    alert("Completa todos los campos requeridos.");
    return;
  }

  const hoy = new Date();
  const fechaSeleccionada = new Date(`${fechaRecogida}T${horaRecogida}:00`);
  const diffMin = (fechaSeleccionada - hoy) / (1000 * 60);

  if (fechaSeleccionada < hoy) {
    alert("⚠️ La fecha y hora seleccionadas ya pasaron. Elige una futura.");
    return;
  }
  if (diffMin < 15) {
    alert("⚠️ El tiempo mínimo de preparación es de 15 minutos.");
    return;
  }

  if (metodo === "tarjeta") {
    const num = document.getElementById("card-number").value.replace(/\s+/g, '');
    const exp = document.getElementById("card-exp").value;
    const cvv = document.getElementById("card-cvv").value;

    if (num.length < 13 || !/^[0-9]+$/.test(num)) return alert("Número de tarjeta inválido (simulado).");
    if (!/^[0-9]{3}$/.test(cvv)) return alert("CVV inválido (3 dígitos).");
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(exp)) return alert("Formato de vencimiento inválido (MM/AA).");
  }

  // Simulación de carga
  checkoutLoading.style.display = "block";
  checkoutLoading.textContent = "Procesando pago (simulado)...";

  setTimeout(() => {
    checkoutLoading.style.display = "none";

    const totalNumber = calcularTotalNumber();

    const pedido = {
      id: Date.now(),
      usuario: usuario.email,
      nombre,
      telefono,
      fechaRecogida,
      horaRecogida,
      metodoPago: metodo,
      carrito: carrito.map(p => ({ ...p })),
      total: totalNumber.toFixed(2),
      fechaPedido: new Date().toLocaleString("es-PE"),
    };

    guardarPedidoUsuario(pedido);

    alert("✅ Pedido confirmado con éxito. ¡Gracias por tu compra!");
    window.location.href = "usuario.html";

    checkoutForm.reset();
    paymentDetails.innerHTML = "";
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    carrito = [];
    actualizarCarrito();
  }, 1200);
});

// 🔹 Guardar pedido en localStorage
function guardarPedidoUsuario(pedido) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.email) return;

  // Guardar pedidos solo para este usuario
  let pedidos = JSON.parse(localStorage.getItem(`pedidos_${usuario.email}`)) || [];
  pedidos.push(pedido);
  localStorage.setItem(`pedidos_${usuario.email}`, JSON.stringify(pedidos));
}

