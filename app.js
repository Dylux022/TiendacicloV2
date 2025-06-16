// app.js

const repuestos = [
  "Bujía NGK",
  "Cadena reforzada",
  "Filtro de aire deportivo",
  "Kit de transmisión",
  "Escape deportivo"
];
const precios = [1500, 4000, 3200, 8500, 12000];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const listaRepuestos = document.getElementById("lista-repuestos");
const carritoHTML = document.getElementById("carrito");
const totalHTML = document.getElementById("total");
const mensaje = document.getElementById("mensaje");
const btnFinalizar = document.getElementById("finalizar");

document.getElementById("resumen").innerHTML = "";

// Mostrar productos con inputs de cantidad
repuestos.forEach((repuesto, index) => {
  const item = document.createElement("div");
  item.innerHTML = `
    <p>${repuesto} - $${precios[index]}</p>
    <input type="number" id="cantidad-${index}" min="1" placeholder="Cantidad">
    <button data-index="${index}">Agregar al carrito</button>
  `;
  listaRepuestos.appendChild(item);
});

// Captura de eventos para los botones "Agregar"
listaRepuestos.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const index = parseInt(e.target.dataset.index);
    const cantidadInput = document.getElementById(`cantidad-${index}`);
    const cantidad = parseInt(cantidadInput.value);

    if (isNaN(cantidad) || cantidad <= 0) {
      mostrarMensaje("Cantidad inválida. Ingresá un número mayor a 0.", true);
      return;
    }

    const subtotal = cantidad * precios[index];
    carrito.push({ repuesto: repuestos[index], cantidad, subtotal });
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderizarCarrito();
    mostrarMensaje(`Agregaste ${cantidad} x ${repuestos[index]} al carrito.`, false);
    cantidadInput.value = "";
  }
});

// Renderiza el carrito con botones "Eliminar"
function renderizarCarrito() {
  carritoHTML.innerHTML = "";
  let total = 0;

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.cantidad} x ${item.repuesto} - $${item.subtotal}
      <button class="eliminar" data-index="${index}">Eliminar</button>
    `;
    carritoHTML.appendChild(li);
    total += item.subtotal;
  });

  totalHTML.textContent = `$${total}`;

  // Captura eventos de los botones "Eliminar"
  const botonesEliminar = document.querySelectorAll(".eliminar");
  botonesEliminar.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      carrito.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(carrito));
      renderizarCarrito();
    });
  });
}

// Mostrar mensaje en el DOM
function mostrarMensaje(texto, esError = false) {
  mensaje.textContent = texto;
  mensaje.style.color = esError ? "red" : "green";
  setTimeout(() => {
    mensaje.textContent = "";
  }, 4000);
}

// Finalizar compra
btnFinalizar.addEventListener("click", () => {
  if (carrito.length === 0) {
    mostrarMensaje("El carrito está vacío.", true);
    return;
  }

  const resumenDiv = document.getElementById("resumen");
  resumenDiv.innerHTML = "<h3>Resumen de tu compra:</h3>";
  let total = 0;

  carrito.forEach(item => {
    const p = document.createElement("p");
    p.textContent = `${item.cantidad} x ${item.repuesto} - $${item.subtotal}`;
    resumenDiv.appendChild(p);
    total += item.subtotal;
  });

  const totalP = document.createElement("p");
  totalP.innerHTML = `<strong>TOTAL: $${total}</strong>`;
  resumenDiv.appendChild(totalP);

  mostrarMensaje("¡Gracias por tu compra!", false);

  carrito = [];
  localStorage.removeItem("carrito");
  renderizarCarrito();
});

// Render inicial si había algo guardado
renderizarCarrito();
