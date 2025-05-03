const token = localStorage.getItem('token');
const backendURL = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080'
  : 'https://patagoniagametech.onrender.com';

let pagina = 1;
const limitePorPagina = 12;
let cargando = false;
let noHayMasProductos = false;

async function cargarProductos(scroll = false) {
  if (cargando || (scroll && noHayMasProductos)) return;
  cargando = true;

  const listaProductos = document.getElementById('listaProductos');

  try {
    const res = await fetch(`${backendURL}/api/productos?pagina=${pagina}&limite=${limitePorPagina}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const productos = await res.json();

    if (scroll && productos.length === 0) {
      noHayMasProductos = true;
      return;
    }

    const html = productos.map(p => `
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
      listaProductos.insertAdjacentHTML('beforeend', html);
      pagina++;
    } else {
      listaProductos.innerHTML = html;
      pagina = 2;
      noHayMasProductos = false;
    }
  } catch (err) {
    console.error('Error al cargar productos:', err);
  } finally {
    cargando = false;
  }
}

window.eliminarProducto = async (id) => {
  if (!confirm('¿Eliminar este producto?')) return;

  try {
    await fetch(`${backendURL}/api/productos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    cargarProductos();
  } catch (err) {
    alert('Error al eliminar producto');
  }
};

window.editarProducto = (id, nombre, descripcion, precioComun, precioMayorista) => {
  document.getElementById('editId').value = id;
  document.getElementById('editNombre').value = decodeURIComponent(nombre);
  document.getElementById('editDescripcion').value = decodeURIComponent(descripcion);
  document.getElementById('editPrecioComun').value = precioComun;
  document.getElementById('editPrecioMayorista').value = precioMayorista;
  document.getElementById('modalEditar').style.display = 'flex';
};

function cerrarModal() {
  document.getElementById('modalEditar').style.display = 'none';
}

document.getElementById('formEditar').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const nombre = document.getElementById('editNombre').value;
  const descripcion = document.getElementById('editDescripcion').value;
  const precioComun = parseFloat(document.getElementById('editPrecioComun').value);
  const precioMayorista = parseFloat(document.getElementById('editPrecioMayorista').value);

  const res = await fetch(`${backendURL}/api/productos/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ nombre, descripcion, precioComun, precioMayorista }),
  });

  if (res.ok) {
    alert('Producto actualizado');
    cerrarModal();
    cargarProductos();
  } else {
    alert('Error al actualizar producto');
  }
});

async function cargarPedidos() {
  const listaPedidos = document.getElementById('listaPedidos');
  if (!listaPedidos) return;

  try {
    const res = await fetch(`${backendURL}/api/pedidos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const pedidos = await res.json();

    listaPedidos.innerHTML = pedidos.map(p => `
      <div class="pedido-admin">
        <p><strong>Usuario:</strong> ${p.usuario?.email || 'Desconocido'}</p>
        <p><strong>Estado:</strong> ${p.estado}</p>
        <ul>
          ${Array.isArray(p.productos) ? p.productos.map(i => `
            <li>${i.producto?.nombre || 'Producto eliminado'} x${i.cantidad}</li>
          `).join('') : '<li>Sin productos</li>'}
        </ul>
        <div>
          <button onclick="actualizarEstado('${p._id}', 'pendiente')">Pendiente</button>
          <button onclick="actualizarEstado('${p._id}', 'en proceso')">En proceso</button>
          <button onclick="actualizarEstado('${p._id}', 'enviado')">Enviado</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error al cargar pedidos:', err);
  }
}

window.actualizarEstado = async (id, estado) => {
  try {
    const res = await fetch(`${backendURL}/api/pedidos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ estado }),
    });

    if (res.ok) {
      alert('Estado actualizado');
      cargarPedidos();
    } else {
      alert('Error al actualizar estado');
    }
  } catch (err) {
    alert('Error de red al actualizar estado');
  }
};

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 100) {
    cargarProductos(true);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('usuario');
  const user = userData ? JSON.parse(userData) : null;

  if (!token || !user || user.rol !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  const form = document.getElementById('formProducto');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Eliminar el campo de la imagen para la prueba (si está presente)
    formData.delete('imagen'); // Eliminar el archivo de imagen del FormData
    
    try {
      const res = await fetch(`${backendURL}/api/productos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        alert('Producto creado');
        form.reset();
        cargarProductos();
      } else {
        const error = await res.json();
        alert('Error al crear producto: ' + error.mensaje);
      }
    } catch (err) {
      alert('Error de red al crear producto');
    }
  });

  cargarProductos();
  cargarPedidos();
  window.addEventListener('scroll', handleScroll);
});



  