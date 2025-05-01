const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String },
  email: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ['usuario', 'admin'], default: 'usuario' }
}, { timestamps: true });

// Antes de guardar, hashea la contraseña si fue modificada
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.compararContraseña = async function (intento) {
  return await bcrypt.compare(intento, this.contraseña);
};

module.exports = mongoose.model('Usuario', usuarioSchema);


