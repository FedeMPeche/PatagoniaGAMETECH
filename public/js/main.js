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

  