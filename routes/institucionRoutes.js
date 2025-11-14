import express from 'express';
import { createInstitucion, getInstituciones, updateInstitucion, deleteInstitucion } from '../controllers/institucionController.js';
import { checkJwt, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Admin
// Todas las rutas necesitan autenticación y rol de admin
router.use(checkJwt, isAdmin);

// GET /api/instituciones
router.get('/', getInstituciones);
// POST /api/instituciones
router.post('/', createInstitucion);
// PUT /api/instituciones/:id
router.put('/:id', updateInstitucion);
// DELETE /api/instituciones/:id

router.delete('/:id', deleteInstitucion);

export default router;
