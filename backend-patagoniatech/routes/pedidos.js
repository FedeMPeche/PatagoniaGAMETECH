const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const { verificarToken, verificarAdmin } = require('../middleware/authMiddleware');

// POST /api/pedidos - Crear pedido (usuario logueado)
router.post('/', verificarToken, async (req, res) => {
  try {
    const { productos, total, datosEnvio } = req.body;

    const nuevoPedido = new Pedido({
      usuario: req.usuarioId,
      productos,
      total,
      datosEnvio
    });

    await nuevoPedido.save();
    res.status(201).json(nuevoPedido);
  } catch (error) {
    console.error('Error al crear pedido:', error); // ⬅️ Agregado
    res.status(500).json({ mensaje: 'Error al crear el pedido' });
  }
});


// GET /api/pedidos/mios - Ver mis pedidos
router.get('/mios', verificarToken, async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuario: req.usuarioId }).populate('productos.producto');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tus pedidos' });
  }
});

// GET /api/pedidos - Ver todos los pedidos (admin)
router.get('/', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuario', 'email').populate('productos.producto');
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener todos los pedidos' });
  }
});

// PUT /api/pedidos/:id - Cambiar estado del pedido (admin)
router.put('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id);
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' });

    pedido.estado = req.body.estado;
    await pedido.save();

    res.json(pedido);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el estado del pedido' });
  }
});

// DELETE /api/pedidos/:id - Eliminar pedido
router.delete('/:id', verificarToken, verificarAdmin, async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pedido:', error);
    res.status(500).json({ mensaje: 'Error al eliminar el pedido' });
  }
});


module.exports = router;
