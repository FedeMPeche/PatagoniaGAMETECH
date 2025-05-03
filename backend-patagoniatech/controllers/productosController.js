const Producto = require('../models/Producto');

// GET /api/productos?pagina=1&limite=8
exports.obtenerProductos = async (req, res) => {
  try {
    const pagina = parseInt(req.query.pagina) || 1;
    const limite = parseInt(req.query.limite) || 10;
    const skip = (pagina - 1) * limite;

    const productos = await Producto.find()
      .skip(skip)
      .limit(limite)
      .sort({ _id: -1 });

    res.json(productos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener productos' });
  }
};

// POST /api/productos
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precioComun, precioMayorista } = req.body;
    const imagenURL = req.file ? `/uploads/${req.file.filename}` : '';

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precioComun,
      precioMayorista,
      imagenes: imagenURL ? [imagenURL] : []
    });

    await nuevoProducto.save();
    res.status(201).json(nuevoProducto);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ mensaje: 'Error al crear producto' });
  }
};

// PUT /api/productos/:id
exports.actualizarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json(producto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar producto' });
  }
};

// DELETE /api/productos/:id
exports.eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado' });
    }
    res.json({ mensaje: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar producto' });
  }
};

