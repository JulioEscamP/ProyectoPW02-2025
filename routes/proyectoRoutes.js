import express from 'express';
import { createProyecto, getProyectos, updateProyecto,getProyectoById, deleteProyecto } from '../controllers/proyectoController.js';
import { checkJwt, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Publico
// GET /api/proyectos
router.get('/', getProyectos);
router.get('/:id', getProyectoById);

// Admin
// POST /api/proyectos 
router.post('/', [checkJwt, isAdmin], createProyecto);
// PUT /api/proyectos/:id
router.put('/:id', [checkJwt, isAdmin], updateProyecto);
// DELETE /api/proyectos/:id
router.delete('/:id', [checkJwt, isAdmin], deleteProyecto);

export default router;
