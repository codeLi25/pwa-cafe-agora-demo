let carrito = [];

const carritoBtn = document.getElementById("btn-carrito");
const carritoPanel = document.getElementById("carrito-panel");
const carritoLista = document.getElementById("carrito-lista");
const contadorCarrito = document.getElementById("carrito-contador");
const totalCarrito = document.getElementById("carrito-total");

// Abrir/cerrar carrito
carritoBtn.addEventListener("click", () => {
    carritoPanel.classList.toggle("open");
});

// Agregar productos
document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", (e) => {
        const item = e.target.closest(".menu-item");
        const nombre = item.querySelector("h4").textContent;
        const precio = parseFloat(item.querySelector(".price").textContent.replace("S/", "").trim());
        agregarAlCarrito(nombre, precio);

        // Mostrar toast de confirmación
        mostrarToast(`"${nombre}" agregado al pedido`);
    });
});

// Función para mostrar toast
function mostrarToast(mensaje) {
    const toast = document.createElement("div");
    toast.className = "toast-notification";
    toast.textContent = mensaje;
    document.body.appendChild(toast);

    // Mostrar con transición
    setTimeout(() => toast.classList.add("show"), 10);

    // Ocultar después de 2 segundos
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => document.body.removeChild(toast), 400);
    }, 2000);
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
    const producto = carrito.find((p) => p.nombre === nombre);
    if (producto) {
        producto.cantidad++;
    } else {
        carrito.push({ nombre, precio, cantidad: 1 });
    }
    actualizarCarrito();
}

function aumentarProducto(nombre) {
    const producto = carrito.find((p) => p.nombre === nombre);
    if (producto) {
        producto.cantidad++;
        actualizarCarrito();
    }
}

function disminuirProducto(nombre) {
    const producto = carrito.find((p) => p.nombre === nombre);
    if (producto) {
        producto.cantidad--;
        if (producto.cantidad <= 0) {
            carrito = carrito.filter((p) => p.nombre !== nombre);
        }
        actualizarCarrito();
    }
}

function eliminarProducto(nombre) {
    carrito = carrito.filter((p) => p.nombre !== nombre);
    actualizarCarrito();
}

function actualizarCarrito() {
    carritoLista.innerHTML = "";

    carrito.forEach((p) => {
        const li = document.createElement("li");
        li.classList.add("carrito-item");
        li.innerHTML = `
            <span>${p.nombre}</span>
            <span>S/ ${(p.precio * p.cantidad).toFixed(2)}</span>
            <div class="acciones">
                <button onclick="disminuirProducto('${p.nombre}')">-</button>
                <span>${p.cantidad}</span>
                <button onclick="aumentarProducto('${p.nombre}')">+</button>
                <button class="eliminar" onclick="eliminarProducto('${p.nombre}')">x</button>
            </div>
        `;
        carritoLista.appendChild(li);
    });

    const totalItems = carrito.reduce((acc, p) => acc + p.cantidad, 0);
    contadorCarrito.textContent = totalItems;
    contadorCarrito.style.display = totalItems > 0 ? "block" : "none";

    const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
    totalCarrito.textContent = "S/ " + total.toFixed(2);
}

// Cerrar carrito
document.getElementById("cerrar-carrito").addEventListener("click", () => {
    carritoPanel.classList.remove("open");
});
