const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

// Rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');
const pedidosRoutes = require('./routes/pedidos');

// Middlewares
app.use(cors({
  origin: ['https://patagonia-gametech.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public')); // Archivos estáticos del frontend
app.use('/uploads', express.static('uploads')); // Archivos subidos (como imágenes)

// ✅ Servir carpeta admin solo en desarrollo
if (process.env.NODE_ENV !== 'production') {
  app.use('/admin', express.static(path.join(__dirname, '../admin')));
}

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch((err) => console.error("❌ Error al conectar MongoDB", err));

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en puerto ${PORT}`);
});



