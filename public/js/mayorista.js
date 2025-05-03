let pagina = 1;
const limitePorPagina = 8;
let cargando = false;
let noHayMasProductos = false;

const backendURL = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080'
  : 'https://patagoniagametech.onrender.com';

const contenedor = document.getElementById("mayorista-grid");
const loader = document.getElementById("loader");
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

async function cargarProductosMayoristas() {
  if (cargando || noHayMasProductos) return;
  cargando = true;
  loader.style.display = "block";

  try {
    const res = await fetch(`${backendURL}/api/productos?pagina=${pagina}&limite=${limitePorPagina}`);
    const data = await res.json();

    if (data.length === 0) {
      noHayMasProductos = true;
      loader.style.display = "none";
      return;
    }

    data.forEach((producto) => {
      const card = document.createElement("div");
      card.className = "producto-card";

      let cantidad = 1;

      card.innerHTML = `
        <img src="${producto.imagenes[0]}" alt="${producto.nombre}" loading="lazy" />
        <div class="producto-info">
          <h4>${producto.nombre}</h4>
          <p>$ ${producto.precioMayorista.toLocaleString("es-AR")}</p>
          <div class="cantidad-control">
            <button class="btn-menos">-</button>
            <span class="cantidad">${cantidad}</span>
            <button class="btn-mas">+</button>
          </div>
          <button class="agregar-carrito">Agregar al carrito</button>
        </div>
      `;

      const btnMenos = card.querySelector(".btn-menos");
      const btnMas = card.querySelector(".btn-mas");
      const spanCantidad = card.querySelector(".cantidad");
      const btnAgregar = card.querySelector(".agregar-carrito");

      btnMenos.addEventListener("click", (e) => {
        e.stopPropagation();
        if (cantidad > 1) {
          cantidad--;
          spanCantidad.textContent = cantidad;
        }
      });

      btnMas.addEventListener("click", (e) => {
        e.stopPropagation();
        cantidad++;
        spanCantidad.textContent = cantidad;
      });

      btnAgregar.addEventListener("click", (e) => {
        e.stopPropagation();
        agregarAlCarrito(producto, cantidad);
        alert(`Se agregó ${cantidad} x ${producto.nombre} al carrito`);
      });

      card.addEventListener("click", () => {
        window.location.href = `detalle.html?id=${producto._id}`;
      });

      contenedor.appendChild(card);
    });

    pagina++;
  } catch (err) {
    console.error("Error al cargar productos mayoristas:", err);
  } finally {
    cargando = false;
    loader.style.display = "none";
  }
}

function agregarAlCarrito(producto, cantidad) {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existente = carrito.find((item) => item._id === producto._id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    cargarProductosMayoristas();
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await cargarProductosMayoristas();
  window.addEventListener("scroll", handleScroll);

  // Solución: seguir cargando si el contenido es menor al alto de la pantalla
  while (
    document.documentElement.scrollHeight <= document.documentElement.clientHeight &&
    !noHayMasProductos
  ) {
    await cargarProductosMayoristas();
  }
});

