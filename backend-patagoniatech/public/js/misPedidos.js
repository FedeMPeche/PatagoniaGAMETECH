const token = localStorage.getItem('token');
const usuarioData = localStorage.getItem('usuario');
const usuario = usuarioData ? JSON.parse(usuarioData) : null;

if (!token || !usuario) {
  window.location.href = 'login.html';
}

async function cargarMisPedidos() {
  const res = await fetch('/api/pedidos/mios', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const pedidos = await res.json();
  const contenedor = document.getElementById('listaMisPedidos');

  contenedor.innerHTML = pedidos.map(p => `
    <div class="pedido-user">
      <p><strong>Estado:</strong> ${p.estado}</p>
      <ul>
        ${Array.isArray(p.productos)
          ? p.productos.map(i => `
              <li>${i.producto?.nombre || 'Producto eliminado'} x${i.cantidad}</li>
            `).join('')
          : '<li>Sin productos</li>'
        }
      </ul>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', cargarMisPedidos);
