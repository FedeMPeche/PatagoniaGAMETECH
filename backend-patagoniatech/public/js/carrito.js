document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('carrito-contenedor');
  const totalCarrito = document.getElementById('total-carrito');
  const finalizarBtn = document.getElementById('finalizar-pedido');

  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  function renderCarrito() {
    contenedor.innerHTML = '';

    if (carrito.length === 0) {
      contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
      totalCarrito.innerHTML = '';
      return;
    }

    carrito.forEach((item, index) => {
      const precioUnitario = item.precioComun || item.precioMayorista;
      const subtotal = precioUnitario * item.cantidad;

      const div = document.createElement('div');
      div.className = 'item-carrito';

      div.innerHTML = `
        <div class="carrito-item-info">
          <h3 class="carrito-nombre">${item.nombre}</h3>
          <p class="carrito-precio">Precio: $ ${precioUnitario.toLocaleString('es-AR')}</p>
          <div class="carrito-cantidad">
            <button class="menos" data-index="${index}">-</button>
            <span>${item.cantidad}</span>
            <button class="mas" data-index="${index}">+</button>
          </div>
          <p class="carrito-subtotal">Subtotal: $ ${subtotal.toLocaleString('es-AR')}</p>
          <button class="eliminar" data-index="${index}">Eliminar</button>
        </div>
      `;

      contenedor.appendChild(div);
    });

    const total = carrito.reduce((acc, item) => {
      const precio = item.precioComun || item.precioMayorista;
      return acc + precio * item.cantidad;
    }, 0);

    totalCarrito.innerHTML = `<h3>Total: $ ${total.toLocaleString('es-AR')}</h3>`;

    addEventListeners();
  }

  function addEventListeners() {
    document.querySelectorAll('.menos').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = btn.dataset.index;
        if (carrito[i].cantidad > 1) carrito[i].cantidad--;
        guardarYRender();
      });
    });

    document.querySelectorAll('.mas').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = btn.dataset.index;
        carrito[i].cantidad++;
        guardarYRender();
      });
    });

    document.querySelectorAll('.eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        const i = btn.dataset.index;
        carrito.splice(i, 1);
        guardarYRender();
      });
    });
  }

  function guardarYRender() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderCarrito();
  }

  finalizarBtn.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Debés iniciar sesión para finalizar tu pedido.');
      window.location.href = 'login.html';
      return;
    }
  
    const confirmacion = confirm("¿Estás seguro de que querés finalizar el pedido?\nRecordá haber realizado la transferencia antes de continuar.");
    if (!confirmacion) {
      return; // No enviar el pedido
    }
  
  
    const productosFormateados = carrito.map(item => {
      if (!item._id) {
        console.warn('Producto sin _id detectado:', item);
      }
      return {
        producto: item._id,
        cantidad: item.cantidad
      };
    });
  
    const productosSinId = productosFormateados.filter(p => !p.producto);
    if (productosSinId.length > 0) {
      alert('Uno o más productos en tu carrito no tienen ID válido. Por favor, volvé a agregarlos.');
      return;
    }
  
    const total = carrito.reduce((acc, item) => {
      const precio = item.precioComun || item.precioMayorista;
      return acc + precio * item.cantidad;
    }, 0);
  
    try {
      const res = await fetch('https://patagonia-gametech-backend.onrender.com/api/pedidos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productos: productosFormateados,
          total
        })
      });
  
      if (res.ok) {
        alert('Pedido enviado con éxito. ¡Gracias por tu compra!');
        localStorage.removeItem('carrito');
        renderCarrito();
      } else {
        const data = await res.json();
        console.error('Error al enviar el pedido:', data);
        alert('Error al enviar el pedido: ' + (data.mensaje || 'Desconocido'));
      }
    } catch (err) {
      console.error('Error al finalizar pedido:', err);
      alert('Ocurrió un error inesperado al finalizar el pedido.');
    }
  });
  
  
  renderCarrito();
});
