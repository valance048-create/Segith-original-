import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());

// AÑADE ESTO AL INICIO de tu server.js (después de los imports)
console.log('🔍 Verificando variables de entorno...');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI:', process.env.MONGO_URI ? 'PRESENTE' : 'UNDEFINED ❌');

// VERIFICACIÓN CRÍTICA - Añade esto antes de mongoose.connect()
if (!process.env.MONGO_URI) {
  console.error('❌ ERROR: MONGO_URI no está definida en variables de entorno');
  console.log('💡 Solución: Configurar MONGO_URI en Render -> Environment');
  process.exit(1); // Detiene la aplicación si no hay MONGO_URI
}

// Permitir requests desde GitHub Pages / dominio
app.use(cors({
  origin: [
    'https://valance048-create.github.io', // ← TU usuario real de GitHub
    'http://localhost:8000',               // ← Para desarrollo local
    'http://localhost:3000'                // ← Para desarrollo local
  ],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Conexión a MongoDB Atlas con variable de entorno
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error de conexión a MongoDB:', err));

// Modelo ejemplo
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  role: { type: String, default: 'student' },
  createdAt: { type: Date, default: Date.now }
}));

// Rutas API
app.get('/', (req, res) => {
  res.send('API de Segith funcionando 🚀');
});

app.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user); // 👉 aquí devolvemos el usuario creado
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Levantar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));