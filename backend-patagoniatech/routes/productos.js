const express = require('express');
const router = express.Router();
const {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} = require('../controllers/productosController');

const Producto = require('../models/Producto');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

// ✅ GET productos públicos con paginación
router.get('/', obtenerProductos);

// ✅ GET producto por ID (público)
router.get('/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener producto' });
  }
});

// ✅ POST nuevo producto con imagen (solo admin)
router.post('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const { nombre, descripcion, precioComun, precioMayorista } = req.body;

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precioComun,
      precioMayorista,
      imagenes: [] // o una URL de prueba
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
});

// ✅ PUT actualizar producto (solo admin)
router.put('/:id', verificarToken, verificarAdmin, actualizarProducto);

// ✅ DELETE producto por ID (solo admin)
router.delete('/:id', verificarToken, verificarAdmin, eliminarProducto);

module.exports = router;

