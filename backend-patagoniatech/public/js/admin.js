const token = localStorage.getItem('token');

// Configuración de paginado
let pagina = 1;
const limitePorPagina = 12;
let cargando = false;
let noHayMasProductos = false;

// 🔄 Cargar productos con paginación infinita
async function cargarProductos(scroll = false) {
  if (cargando || (scroll && noHayMasProductos)) return;
  cargando = true;

  const listaProductos = document.getElementById('listaProductos');

  try {
    const res = await fetch(`/api/productos?pagina=${pagina}&limite=${limitePorPagina}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const productos = await res.json();

    if (scroll && productos.length === 0) {
      noHayMasProductos = true;
      return;
    }

    const nuevosProductos = productos.map(p => `
      <div class="producto-admin">
        <img src="${p.imagenes?.[0] || '/img/default.png'}" alt="${p.nombre}" style="max-width:100px" />
        <h3>${p.nombre}</h3>
        <p>Precio común: $${p.precioComun.toLocaleString()}</p>
        <p>Precio mayorista: $${p.precioMayorista.toLocaleString()}</p>
        <button onclick="eliminarProducto('${p._id}')">Eliminar</button>
        <button onclick="editarProducto('${p._id}', '${encodeURIComponent(p.nombre)}', '${encodeURIComponent(p.descripcion)}', ${p.precioComun}, ${p.precioMayorista})">Editar</button>
      </div>
    `).join('');

    if (scroll) {
      listaProductos.insertAdjacentHTML('beforeend', nuevosProductos);
      pagina++;
    } else {
      listaProductos.innerHTML = nuevosProductos;
      pagina = 2; // Reseteamos a 2 para la carga infinita
      noHayMasProductos = false;
    }
  } catch (err) {
    console.error('Error cargando productos:', err);
  } finally {
    cargando = false;
  }
}

// 🗑️ Eliminar producto
window.eliminarProducto = async (id) => {
  if (confirm('¿Eliminar este producto?')) {
    await fetch(`/api/productos/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    cargarProductos(); // Recarga lista desde 0 después de eliminar
  }
};

// ✏️ Editar producto - abrir modal
window.editarProducto = (id, nombre, descripcion, precioComun, precioMayorista) => {
  document.getElementById('editId').value = id;
  document.getElementById('editNombre').value = decodeURIComponent(nombre);
  document.getElementById('editDescripcion').value = decodeURIComponent(descripcion);
  document.getElementById('editPrecioComun').value = precioComun;
  document.getElementById('editPrecioMayorista').value = precioMayorista;
  document.getElementById('modalEditar').style.display = 'flex';
};

// ❌ Cerrar modal
function cerrarModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

// ✅ Enviar edición de producto
document.getElementById('formEditar').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const nombre = document.getElementById('editNombre').value;
  const descripcion = document.getElementById('editDescripcion').value;
  const precioComun = document.getElementById('editPrecioComun').value;
  const precioMayorista = document.getElementById('editPrecioMayorista').value;

  const res = await fetch(`/api/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nombre,
      descripcion,
      precioComun,
      precioMayorista
    }),
  });

  if (res.ok) {
    alert('Producto actualizado');
    cerrarModal();
    cargarProductos(); // Recarga lista después de editar
  } else {
    alert('Error al actualizar producto');
  }
});

// 📦 Cargar pedidos
async function cargarPedidos() {
  const res = await fetch('/api/pedidos', {
    headers: { Authorization: `Bearer ${token}` },
  });
  const pedidos = await res.json();

  const listaPedidos = document.getElementById('listaPedidos');
  if (!listaPedidos) return; // Si no está en esta página, no hacer nada

  listaPedidos.innerHTML = pedidos.map(p => `
    <div class="pedido-admin">
      <p><strong>Usuario:</strong> ${p.usuario?.email || 'Desconocido'}</p>
      <p><strong>Estado actual:</strong> ${p.estado}</p>
      <p><strong>Productos:</strong></p>
      <ul>
        ${Array.isArray(p.productos)
          ? p.productos.map(i => `
              <li>${i.producto?.nombre || 'Producto eliminado'} x${i.cantidad}</li>
            `).join('')
          : '<li>Sin productos</li>'
        }
      </ul>
      <div>
        <button onclick="actualizarEstado('${p._id}', 'pendiente')">Pendiente</button>
        <button onclick="actualizarEstado('${p._id}', 'en proceso')">En proceso</button>
        <button onclick="actualizarEstado('${p._id}', 'enviado')">Enviado</button>
      </div>
    </div>
  `).join('');
}

// 📥 Actualizar estado de pedido
window.actualizarEstado = async (pedidoId, nuevoEstado) => {
  const res = await fetch(`/api/pedidos/${pedidoId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ estado: nuevoEstado }),
  });

  if (res.ok) {
    alert('Estado actualizado');
    cargarPedidos();
  } else {
    alert('Error al actualizar estado');
  }
};

// ⏬ Detectar scroll para cargar más productos
function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    cargarProductos(true); // true = modo scroll
  }
}

// 🚀 Inicio
document.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('usuario'); 
  const user = userData ? JSON.parse(userData) : null;

  if (!token || !user || user.rol !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  const form = document.getElementById('formProducto');

  // ➕ Crear nuevo producto
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData
    });

    if (res.ok) {
      alert('Producto creado');
      form.reset();
      cargarProductos();
    } else {
      const error = await res.json();
      alert('Error al crear producto: ' + error.mensaje);
    }
  });

  // ⏬ Carga inicial
  cargarProductos();
  cargarPedidos();

  // 📜 Scroll infinito
  window.addEventListener('scroll', handleScroll);
});

  