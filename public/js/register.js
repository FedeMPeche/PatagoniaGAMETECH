// const registerForm = document.getElementById("formRegistro");
// const registerError = document.getElementById("registerError");

// const backendURL = window.location.hostname.includes("localhost")
//   ? "http://localhost:8080"
//   : "https://patagoniagametech.onrender.com";

// registerForm.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   registerError.textContent = ""; // limpiar errores anteriores

//   const email = document.getElementById("email").value.trim();
//   const password = document.getElementById("password").value;
//   const confirmPassword = document.getElementById("confirmPassword").value;
//   const nombre = document.getElementById("nombre").value.trim();

//   if (!email || !password || !confirmPassword || !nombre) {
//     registerError.textContent = "Por favor completá todos los campos.";
//     return;
//   }

//   if (password.length < 6) {
//     registerError.textContent = "La contraseña debe tener al menos 6 caracteres.";
//     return;
//   }

//   if (password !== confirmPassword) {
//     registerError.textContent = "Las contraseñas no coinciden.";
//     return;
//   }

//   const boton = registerForm.querySelector("button[type='submit']");
//   boton.disabled = true;

//   try {
//     const res = await fetch(`${backendURL}/api/auth/register`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password, nombre }),
//     });

//     const data = await res.json();

//     if (!res.ok) {
//       registerError.textContent = data.msg || "Error al registrarse.";
//       return;
//     }

//     alert("¡Cuenta creada con éxito! Ahora podés iniciar sesión.");
//     window.location.href = "login.html";
//   } catch (err) {
//     console.error("Error:", err);
//     registerError.textContent = "Error al conectar con el servidor.";
//   } finally {
//     boton.disabled = false;
//   }
// });


