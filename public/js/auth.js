const loginForm = document.getElementById("formLogin");
const loginError = document.getElementById("loginError");
const backendURL = window.location.hostname.includes("localhost")
  ? "http://localhost:8080"
  : "https://patagoniagametech.onrender.com";

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = ""; // Limpiar mensaje anterior

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    loginError.textContent = "Por favor completá todos los campos.";
    return;
  }

  const boton = loginForm.querySelector("button[type='submit']");
  boton.disabled = true;

  try {
    const res = await fetch(`${backendURL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      loginError.textContent = data.msg || "Error al iniciar sesión";
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("usuario", JSON.stringify(data.usuario));

    // Redirigir según el rol
    if (data.usuario.rol === "admin") {
      window.location.href = "admin.html";
    } else {
      window.location.href = "index.html";
    }
  } catch (err) {
    console.error("Error:", err);
    loginError.textContent = "Error al conectar con el servidor.";
  } finally {
    boton.disabled = false;
  }
});

