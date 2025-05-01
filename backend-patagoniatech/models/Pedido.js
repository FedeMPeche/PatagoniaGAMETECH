const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    cantidad: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  estado: { type: String, enum: ['pendiente', 'en proceso', 'enviado'], default: 'pendiente' },
  datosTransferencia: {
    tipo: { type: String, default: 'transferencia bancaria' },
    instrucciones: { type: String, default: 'Transferir a CBU 0000-0000-0000-0000' }
  }
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
