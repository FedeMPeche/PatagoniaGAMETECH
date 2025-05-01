const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  imagenes: [{ type: String }], // Array de URLs
  precioComun: { type: Number, required: true },
  precioMayorista: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
