const form = document.getElementById('formRegistro');
const errorElement = document.getElementById('registerError');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const backendURL = window.location.hostname.includes('localhost')
  ? 'http://localhost:8080'
  : 'https://patagoniagametech.onrender.com';


// Verifica coincidencia mientras el usuario escribe
confirmInput.addEventListener('input', () => {
  if (confirmInput.value !== passwordInput.value) {
    errorElement.textContent = '⚠️ Las contraseñas no coinciden.';
  } else {
    errorElement.textContent = '';
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmInput.value;
  const nombre = document.getElementById('nombre').value.trim();

  if (password !== confirmPassword) {
    errorElement.textContent = '⚠️ Las contraseñas no coinciden.';
    return;
  }

  errorElement.textContent = '';

  try {
    const res = await fetch(`${backendURL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nombre }) 
    });

    const data = await res.json();

    if (res.ok) {
      alert('✅ Registro exitoso. Iniciá sesión.');
      window.location.href = 'login.html';
    } else {
      errorElement.textContent = data.msg || '❌ Error al registrarse.';
    }
  } catch (err) {
    console.error(err);
    errorElement.textContent = '❌ No se pudo conectar con el servidor.';
  }
});
