// index.js
import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

const app = express();
app.use(express.json()); 

conectarDB();


app.use(cors());

app.use('/api/usuarios', usuarioRoutes);
// TODO: Routes de proyectos
// TODO: Routes de instituciones

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});