import express from "express";
import {
  registrarUsuario,
  loginUsuario,
  getPerfil,
} from "../controllers/usuarioController.js";
import { checkJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", registrarUsuario);
// POST /api/usuarios/login
router.post("/login", loginUsuario);
// GET /api/usuarios/perfil
router.get("/perfil", checkJwt, getPerfil);

export default router;