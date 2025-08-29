import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());

// Permitir requests desde GitHub Pages / dominio
app.use(cors({
  origin: [
    'https://tuusuario.github.io',    // si publicas así
    'https://segith.com'              // si usas dominio propio (ajusta)
  ],
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));