const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Generar token JWT
const generarToken = (usuarioId, rol) => {
  return jwt.sign({ id: usuarioId, rol }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// POST /api/usuarios/registro
exports.registrarUsuario = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }

    const nuevoUsuario = new Usuario({ email, password, nombre });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario._id, nuevoUsuario.rol);

    res.status(201).json({
      token,
      usuario: {
        _id: nuevoUsuario._id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario', error: error.message });
  }
};

// POST /api/usuarios/login
exports.loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const passwordValido = await usuario.compararPassword(password);
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario._id, usuario.rol);

    res.json({
      token,
      usuario: {
        _id: usuario._id,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error("🔥 ERROR en loginUsuario:", error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error: error.message });
  }
};

// GET /api/usuarios/perfil
exports.obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuarioId).select('-contraseña');
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener perfil' });
  }
};

// PUT /api/usuarios/perfil
exports.actualizarPerfil = async (req, res) => {
  try {
    const { nombre, email, contraseña } = req.body;

    const usuario = await Usuario.findById(req.usuarioId);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    if (nombre) usuario.nombre = nombre;
    if (email) usuario.email = email;
    if (contraseña) usuario.contraseña = contraseña;

    await usuario.save();

    res.json({
      mensaje: 'Perfil actualizado',
      usuario: {
        _id: usuario._id,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
};
