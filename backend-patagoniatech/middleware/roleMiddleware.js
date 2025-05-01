exports.verificarAdmin = (req, res, next) => {
    if (req.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado: se requiere rol de administrador' });
    }
    next();
  };
  