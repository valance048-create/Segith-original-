import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 1. Cargar variables de entorno PRIMERO
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 2. VERIFICACIÓN CRÍTICA de variables de entorno
console.log('🔍 Verificando variables de entorno...');
if (!process.env.MONGO_URI) {
  console.error('❌ ERROR CRÍTICO: MONGO_URI no está definida');
  console.log('💡 Solución: Configura esta variable en Render -> Environment Groups');
  console.log('💡 Nombre variable: MONGO_URI');
  console.log('💡 Valor: mongodb+srv://usuario:password@cluster...');
  process.exit(1);
}
console.log('✅ Variables de entorno verificadas');

// Middleware
app.use(express.json());

// Permitir requests desde GitHub Pages / dominio
app.use(cors({
  origin: [
    'https://tuusuario.github.io', // si publicas así
    'https://segith.com',          // si usas dominio propio (ajusta)
    'http://localhost:8000'        // para desarrollo local
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Conexión a MongoDB Atlas con variable de entorno y manejo mejorado
const uri = process.env.MONGO_URI;

console.log('🔗 Intentando conectar a MongoDB...');
console.log('📝 URI de MongoDB:', process.env.MONGO_URI ? 'Presente (oculta por seguridad)' : 'NO DEFINIDA');

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout después de 5 segundos
  socketTimeoutMS: 45000, // Cierra sockets después de 45s de inactividad
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => {
  console.error('❌ Error de conexión a MongoDB:', err.message);
  console.log('💡 Si es error de autenticación, verifica usuario/contraseña en MONGO_URI');
  console.log('💡 Si es error de red, verifica la IP en MongoDB Atlas Whitelist');
});

// Eventos de conexión para mejor diagnóstico
const db = mongoose.connection;

db.on('error', (err) => {
  console.error('❌ Error general de MongoDB:', err);
});

db.on('disconnected', () => {
  console.log('⚠️  MongoDB desconectado');
});

db.on('reconnected', () => {
  console.log('🔁 MongoDB reconectado');
});

// Modelo ejemplo
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  role: { type: String, default: 'student' },
  createdAt: { type: Date, default: Date.now }
}));

// Middleware para verificar conexión a BD antes de procesar requests
app.use((req, res, next) => {
  if (db.readyState !== 1) { // 1 = conectado
    return res.status(503).json({ 
      error: 'Base de datos no disponible',
      message: 'Intentando reconectar...' 
    });
  }
  next();
});

// Rutas API
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de Segith funcionando 🚀',
    database: db.readyState === 1 ? 'Conectado' : 'Desconectado',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint para Render
app.get('/health', (req, res) => {
  const status = {
    status: db.readyState === 1 ? 'healthy' : 'unhealthy',
    database: db.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(db.readyState === 1 ? 200 : 503).json(status);
});

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      error: 'Error al crear usuario',
      details: process.env.NODE_ENV === 'production' ? undefined : error.message 
    });
  }
});

// Ruta para verificar variables de entorno (solo desarrollo)
if (process.env.NODE_ENV !== 'production') {
  app.get('/debug/env', (req, res) => {
    res.json({
      mongoUri: process.env.MONGO_URI ? 'Presente (oculta)' : 'No definida',
      nodeEnv: process.env.NODE_ENV,
      port: process.env.PORT
    });
  });
}

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor Segith backend ejecutándose`);
  console.log(`📍 Puerto: ${PORT}`);
  console.log(`🌐 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Estado BD: ${db.readyState === 1 ? 'Conectado' : 'Desconectado'}`);
  
  // Verificación final
  if (!process.env.MONGO_URI) {
    console.log('\n❌ ADVERTENCIA: MONGO_URI no está definida');
    console.log('💡 El servidor iniciará pero no podrá conectarse a MongoDB');
  }
});