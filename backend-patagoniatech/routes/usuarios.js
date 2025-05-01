const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');

// Registro y login
router.post('/registro', authController.registrarUsuario);
router.post('/login', authController.loginUsuario);

// Perfil protegido
router.get('/perfil', verificarToken, authController.obtenerPerfil);
router.put('/perfil', verificarToken, authController.actualizarPerfil);

module.exports = router;
