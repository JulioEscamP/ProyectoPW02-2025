import express from 'express';
import { registrarUsuario } from '../controllers/usuarioController.js';

const router = express.Router();


// POST /api/usuarios/ (En teoria podria funcionar para registrar admins tmb)
//TODO: probar para admin o modificar.


router.post('/', registrarUsuario);

// TODO: Ruta login
// router.post('/login', loginUsuario);

// TODO: Ruta perfil (Tentativa)
// router.get('/perfil', authMiddleware, obtenerPerfil);

export default router;