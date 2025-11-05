import express from 'express';
import { 
  createAplicacion, 
  getAplicacionesPorProyecto, 
  updateEstadoAplicacion,
  getMisAplicaciones
} from '../controllers/aplicacionController.js';
import { checkJwt, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Usuario (estudiante)
// POST /api/aplicaciones
router.post('/', checkJwt, createAplicacion);
// GET /api/aplicaciones/mis-aplicaciones
router.get('/mis-aplicaciones', checkJwt, getMisAplicaciones);

// Admin
// GET /api/aplicaciones/proyecto/:id
router.get('/proyecto/:id', [checkJwt, isAdmin], getAplicacionesPorProyecto);
// PUT /api/aplicaciones/:id
router.put('/:id', [checkJwt, isAdmin], updateEstadoAplicacion);

export default router;
