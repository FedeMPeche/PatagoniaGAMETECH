const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const usuariosRoutes = require('./routes/usuarios');
const pedidosRoutes = require('./routes/pedidos');

// Inicializar app
const app = express();

// Middlewares
app.use(cors({
  origin: ['https://patagonia-gametech.vercel.app'],
  credentials: true
}));
app.use(express.json());
app.use(express.static('public')); // Archivos estáticos del frontend
app.use('/uploads', express.static('uploads')); // Archivos subidos (como imágenes)

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/pedidos', pedidosRoutes);

// SPA (Single Page Application) - servir index.html solo si NO es una ruta de la API
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ mensaje: 'Ruta de API no encontrada' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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


