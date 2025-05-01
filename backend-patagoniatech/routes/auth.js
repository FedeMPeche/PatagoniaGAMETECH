const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verificarToken } = require('../middleware/authMiddleware');

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
  const { nombre, email, contraseña } = req.body;

  try {
    const existeUsuario = await Usuario.findOne({ email });
    if (existeUsuario) {
      return res.status(400).json({ mensaje: 'El usuario ya existe' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashContraseña = await bcrypt.hash(contraseña, salt);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      contraseña: hashContraseña
    });

    await nuevoUsuario.save();

    const token = jwt.sign({ id: nuevoUsuario._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) return res.status(400).json({ mensaje: 'Usuario no encontrado' });

    const esValido = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValido) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ token, usuario: { id: usuario._id, email: usuario.email, rol: usuario.rol } });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});

// GET /api/auth/perfil
router.get('/perfil', verificarToken, async (req, res) => {
  res.json(req.usuario);
});

module.exports = router;
