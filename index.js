// index.js
import express from "express";
import "dotenv/config";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import institucionRoutes from './routes/institucionRoutes.js';
import proyectoRoutes from './routes/proyectoRoutes.js';
import aplicacionRoutes from './routes/aplicacionRoutes.js';

const app = express();
app.use(express.json());

conectarDB();

app.use(cors());

app.use("/api/usuarios", usuarioRoutes);
app.use('/api/instituciones', institucionRoutes);
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/aplicaciones', aplicacionRoutes);

app.use((req, res) => {
  res
    .status(404)
    .json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
