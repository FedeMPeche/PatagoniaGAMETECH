document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const backendURL = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080'
  : 'https://patagoniagametech.onrender.com';


  if (!token || !usuario) {
    location.href = "login.html";
    return;
  }

  const datosPerfil = document.getElementById("datosPerfil");
  datosPerfil.innerHTML = `
    <p><strong>Email:</strong> ${usuario.email}</p>
    <p><strong>Rol:</strong> ${usuario.rol}</p>
  `;

  const listaPedidos = document.getElementById("listaPedidos");
  const detallePedido = document.getElementById("detallePedido");

  try {
    const res = await fetch(`${backendURL}/api/pedidos/mios`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const pedidos = await res.json();

    if (Array.isArray(pedidos) && pedidos.length > 0) {
      pedidos.forEach((pedido) => {
        const item = document.createElement("li");
        item.innerHTML = `
          <strong>Pedido #${pedido._id}</strong> - Estado: ${pedido.estado}
          <button class="ver-detalle" data-id="${pedido._id}">Ver productos</button>
        `;
        listaPedidos.appendChild(item);
      });

      // Delegación para botones "Ver productos"
      listaPedidos.addEventListener("click", (e) => {
        if (e.target.classList.contains("ver-detalle")) {
          const pedidoId = e.target.getAttribute("data-id");
          const pedido = pedidos.find(p => p._id === pedidoId);
          if (pedido) {
            mostrarDetallePedido(pedido);
          }
        }
      });
    } else {
      listaPedidos.innerHTML = "<li>No tenés pedidos todavía.</li>";
    }
  } catch (error) {
    console.error("Error cargando pedidos:", error);
  }

  // Redirección botón perfil desde navbar (opcional)
  const perfilBtn = document.getElementById("perfilBtn");
  if (perfilBtn) {
    perfilBtn.addEventListener("click", () => {
      if (!token || !usuario) {
        window.location.href = "login.html";
      } else {
        window.location.href = "perfil.html";
      }
    });
  }
});

// Cerrar sesión
function cerrarSesion() {
  localStorage.clear();
  window.location.href = "index.html";
}

// Mostrar detalle del pedido
function mostrarDetallePedido(pedido) {
  const detalle = document.getElementById("detallePedido");

  detalle.innerHTML = `
    <h3 class="titulo-pedido">Detalle del Pedido <span style="color: #0bd476">#${pedido._id}</span></h3>
    <ul class="lista-productos">
      ${pedido.productos.map(p => `
        <li>
          <strong>${p.producto?.nombre || "Producto eliminado"}</strong> - Cantidad: ${p.cantidad}
        </li>
      `).join("")}
    </ul>
    <button id="btnCerrarDetalle" class="cerrar-detalle">Cerrar</button>
  `;

  detalle.classList.remove("oculto");

  // Escuchar el evento click/tap en el botón generado dinámicamente
  const cerrarBtn = document.getElementById("btnCerrarDetalle");
  if (cerrarBtn) {
    cerrarBtn.addEventListener("click", cerrarDetalle);
  } else {
    console.warn("Botón de cerrar no encontrado");
  }
}

// Ocultar detalle del pedido
function cerrarDetalle() {
  const detalle = document.getElementById("detallePedido");
  if (detalle) {
    detalle.classList.add("oculto");
    detalle.innerHTML = ""; // Limpia el contenido por si se vuelve a mostrar
  }
}



