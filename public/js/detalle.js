document.addEventListener('DOMContentLoaded', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const detalleContainer = document.getElementById('detalleProducto');

  if (!id) {
    detalleContainer.innerHTML = '<p>Producto no encontrado.</p>';
    return;
  }

  fetch(`/api/productos/${id}`)
    .then(res => res.json())
    .then(producto => {
      detalleContainer.innerHTML = `
        <div class="detalle-card">
          <div class="imagenes">
            ${producto.imagenes.map(img => `<img src="${img}" alt="${producto.nombre}">`).join('')}
          </div>
          <div class="info">
            <h2>${producto.nombre}</h2>
            <p>${producto.descripcion}</p>
            <p class="precio">$ ${producto.precioComun.toLocaleString('es-AR')}</p>
            <div class="cantidad">
              <button id="decrementar">-</button>
              <input type="number" id="cantidad" value="1" min="1" />
              <button id="incrementar">+</button>
            </div>
            <button id="agregarCarrito">Agregar al Carrito</button>
          </div>
        </div>
      `;

      // Lógica de cantidad
      const inputCantidad = document.getElementById('cantidad');
      document.getElementById('incrementar').onclick = () => inputCantidad.value = parseInt(inputCantidad.value) + 1;
      document.getElementById('decrementar').onclick = () => {
        if (parseInt(inputCantidad.value) > 1) inputCantidad.value = parseInt(inputCantidad.value) - 1;
      };

      // Agregar al carrito (con lógica común unificada)
      document.getElementById('agregarCarrito').addEventListener('click', () => {
        const cantidad = parseInt(inputCantidad.value);
        agregarAlCarrito(producto, cantidad);
      });
    })
    .catch(err => {
      console.error('Error al cargar detalle:', err);
      detalleContainer.innerHTML = '<p>Error al cargar el producto.</p>';
    });
});

// Función compartida con productos.js y detalle.js
function agregarAlCarrito(producto, cantidad) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const existente = carrito.find(p => p._id === producto._id);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({ ...producto, cantidad });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert('Producto agregado al carrito');
}
