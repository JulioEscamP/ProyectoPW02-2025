import express from "express";
import { recibirWebhookFormulario, verificarWebhook } from "../controllers/webhookController.js";

const router = express.Router();

router.get("/", verificarWebhook);
router.post("/aplicacion", recibirWebhookFormulario);

export default router;