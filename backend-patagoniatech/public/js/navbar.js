document.addEventListener("DOMContentLoaded", () => {
  controlarNavbarPorUsuario();
  actualizarCarritoNavbar();
});

// 👉 Función para controlar el estado del navbar (login / admin / invitado)
function controlarNavbarPorUsuario() {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  const perfilBtn = document.getElementById("perfilBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (perfilBtn) {
    perfilBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (token && usuario) {
        if (usuario.rol === "admin") {
          window.location.href = "admin.html";
        } else {
          window.location.href = "perfil.html";
        }
      } else {
        window.location.href = "login.html";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      window.location.href = "index.html";
    });
  }

  // Mostrar u ocultar elementos del navbar según login y rol
  const elementosSoloInvitado = document.querySelectorAll(".solo-invitado");
  const elementosSoloLogueado = document.querySelectorAll(".solo-logueado");
  const elementosSoloAdmin = document.querySelectorAll(".solo-admin");

  if (token && usuario) {
    elementosSoloInvitado.forEach(el => el.style.display = "none");
    elementosSoloLogueado.forEach(el => el.style.display = "inline-block");

    if (usuario.rol === "admin") {
      elementosSoloAdmin.forEach(el => el.style.display = "inline-block");
    } else {
      elementosSoloAdmin.forEach(el => el.style.display = "none");
    }
  } else {
    elementosSoloInvitado.forEach(el => el.style.display = "inline-block");
    elementosSoloLogueado.forEach(el => el.style.display = "none");
    elementosSoloAdmin.forEach(el => el.style.display = "none");
  }
}

// 👉 Función para actualizar el contador de productos en el carrito
function actualizarCarritoNavbar() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const carritoLink = document.getElementById('carrito-navbar');
  if (carritoLink) {
    if (totalCantidad > 0) {
      carritoLink.innerHTML = `🛒 CARRITO (${totalCantidad})`;
    } else {
      carritoLink.innerHTML = `🛒 CARRITO`;
    }
  }
}

// 👉 Función para animar el carrito cuando se agrega un producto
function animarCarrito() {
  const carritoLink = document.getElementById('carrito-navbar');
  if (carritoLink) {
    carritoLink.classList.add('carrito-animado');
    setTimeout(() => {
      carritoLink.classList.remove('carrito-animado');
    }, 800);
  }
}

// 👉 Función principal para agregar productos al carrito
function agregarAlCarrito(producto, cantidad) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

  const itemExistente = carrito.find(item => item._id === producto._id);

  if (itemExistente) {
    itemExistente.cantidad += cantidad;
  } else {
    carrito.push({
      _id: producto._id,
      nombre: producto.nombre,
      precioComun: producto.precioComun,
      cantidad: cantidad
    });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarritoNavbar();
  animarCarrito();
  alert(`Se agregó ${cantidad} x ${producto.nombre} al carrito`);
}

  
  
  