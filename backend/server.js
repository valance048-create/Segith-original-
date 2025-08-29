import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas con variable de entorno
const uri = process.env.MONGO_URI;

mongoose.connect(uri)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error(err));

// Modelo ejemplo
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  role: { type: String, default: 'student' },
  createdAt: { type: Date, default: Date.now }
}));

// Rutas API
app.get('/', (req, res) => res.send('API de Segith funcionando 🚀'));
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));