document.addEventListener('DOMContentLoaded', async () => {
    const carousel = document.getElementById('destacados-carousel');
  
    try {
      const res = await fetch('/api/productos');
      const productos = await res.json();
  
      // Filtramos solo los 5 primeros como ejemplo de destacados
      const destacados = productos.slice(0, 5);
  
      destacados.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'producto-destacado';
  
        card.innerHTML = `
          <img src="${prod.imagenes[0]}" alt="${prod.nombre}" />
          <h4>${prod.nombre}</h4>
        `;
  
        card.addEventListener('click', () => {
          window.location.href = `productos.html?id=${prod._id}`;
        });
  
        carousel.appendChild(card);
      });
    } catch (error) {
      console.error('Error al cargar productos destacados:', error);
      carousel.innerHTML = `<p>No se pudieron cargar los productos destacados.</p>`;
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("usuario"));
  
    const mostrar = (selector) =>
      document.querySelectorAll(selector).forEach(e => e.style.display = "inline-block");
  
    const ocultar = (selector) =>
      document.querySelectorAll(selector).forEach(e => e.style.display = "none");
  
    if (token && user) {
      ocultar(".solo-invitado");
      mostrar(".solo-logueado");
  
      if (user.rol === "admin") {
        mostrar(".solo-admin");
      } else {
        ocultar(".solo-admin");
      }
    } else {
      mostrar(".solo-invitado");
      ocultar(".solo-logueado");
      ocultar(".solo-admin");
    }
  
    // Logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        location.href = "index.html";
      });
    }
  });
  
  