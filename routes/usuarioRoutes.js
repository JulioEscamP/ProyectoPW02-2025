import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  getPerfil,
} from "../controllers/usuarioController.js";
import { checkJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/usuarios/ (En teoria podria funcionar para registrar admins tmb)
//! creo que es mejor implementar que solo se registren usuarios normales y
//! se necesite una cuenta de admin para crear otros admins
// TODO implementar esa logica
router.post("/", registrarUsuario);
// POST /api/usuarios/login
router.post("/login", loginUsuario);
// GET /api/usuarios/perfil
router.get("/perfil", checkJwt, getPerfil);

export default router;