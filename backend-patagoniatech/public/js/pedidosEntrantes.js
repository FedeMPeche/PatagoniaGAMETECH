// pedidosEntrantes.js

const token = localStorage.getItem('token');

async function cargarPedidos() {
  try {
    const res = await fetch('/api/pedidos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Error al obtener pedidos');
    }

    const pedidos = await res.json();
    const listaPedidos = document.getElementById('listaPedidos');

    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      listaPedidos.innerHTML = "<p>No hay pedidos para mostrar.</p>";
      return;
    }

    listaPedidos.innerHTML = pedidos.map(p => `
      <div class="pedido-admin">
        <p><strong>Usuario:</strong> ${p.usuario?.email || 'Desconocido'}</p>
        <p><strong>Estado actual:</strong> ${p.estado}</p>
        <p><strong>Total:</strong> $${p.total?.toLocaleString('es-AR') || '0'}</p>
        <p><strong>Productos:</strong></p>
        <ul>
          ${Array.isArray(p.productos)
            ? p.productos.map(i => `
              <li>${i.producto?.nombre || 'Producto eliminado'} x${i.cantidad}</li>
            `).join('')
            : '<li>Sin productos</li>'
          }
        </ul>
        <div class="botones-estado">
          <button onclick="actualizarEstado('${p._id}', 'pendiente')">Pendiente</button>
          <button onclick="actualizarEstado('${p._id}', 'en proceso')">En proceso</button>
          <button onclick="actualizarEstado('${p._id}', 'enviado')">Enviado</button>
        </div>
        <div class="botones-accion">
          <button class="btn-eliminar" onclick="eliminarPedido('${p._id}')">🗑️ Eliminar</button>
        </div>
      </div>
    `).join('');
    
  } catch (error) {
    console.error(error);
    alert('Hubo un error al cargar los pedidos.');
  }
}

// Función para actualizar estado
window.actualizarEstado = async (pedidoId, nuevoEstado) => {
  try {
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
  } catch (error) {
    console.error(error);
    alert('Error de conexión al actualizar pedido');
  }
};

// 🗑️ Función para eliminar pedido
window.eliminarPedido = async (pedidoId) => {
  if (!confirm('¿Seguro que querés eliminar este pedido? Esta acción no se puede deshacer.')) {
    return;
  }

  try {
    const res = await fetch(`/api/pedidos/${pedidoId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert('Pedido eliminado exitosamente.');
      cargarPedidos();
    } else {
      alert('Error al eliminar el pedido.');
    }
  } catch (error) {
    console.error(error);
    alert('Error de conexión al eliminar el pedido');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const userData = localStorage.getItem('usuario');
  const user = userData ? JSON.parse(userData) : null;

  if (!token || !user || user.rol !== 'admin') {
    window.location.href = 'login.html';
    return;
  }

  cargarPedidos();
});
