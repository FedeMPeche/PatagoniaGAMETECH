const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const verificarToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Guardamos el ID del usuario para usar en los controladores
    req.usuarioId = decoded.id;

    // También guardamos el usuario completo si lo necesitás
    req.usuario = await Usuario.findById(decoded.id).select('-contraseña');

    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

const verificarAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next();
  } else {
    res.status(403).json({ mensaje: 'Acceso denegado: solo administradores' });
  }
};

module.exports = {
  verificarToken,
  verificarAdmin
};
