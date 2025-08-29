import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());

// Permitir requests desde GitHub Pages / dominio
app.use(cors({
  origin: [
    'https://tuusuario.github.io', // si publicas así
    'https://segith.com'           // si usas dominio propio (ajusta)
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Conexión a MongoDB Atlas con variable de entorno
const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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