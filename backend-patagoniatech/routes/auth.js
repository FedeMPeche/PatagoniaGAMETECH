const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verificarToken } = require('../middleware/authMiddleware');

// POST /api/auth/registro
router.post('/register', async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashContraseña = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contraseña: hashContraseña
    });

    await nuevoUsuario.save();

    // Crear el token JWT
    const token = jwt.sign({ id: nuevoUsuario._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Responder con el token
    res.status(201).json({ token });
  } catch (error) {
    console.error(error); // Imprimir el error para depuración
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    // Buscar al usuario por el email
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: 'Usuario no encontrado' });

    // Comparar la contraseña
    const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValido) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    // Crear el token JWT
    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Responder con el token y los datos del usuario
    res.json({ token, usuario: { id: usuario._id, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    console.error(error); // Imprimir el error para depuración
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

// GET /api/auth/perfil
router.get('/perfil', verificarToken, async (req, res) => {
  res.json(req.usuario);
});

module.exports = router;
