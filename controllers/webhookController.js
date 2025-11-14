import Aplicacion from "../models/Aplicacion.js";
import Usuario from "../models/Usuario.js";
import Proyecto from "../models/Proyecto.js";
import { agregarFilaAplicacion } from "../service/googleSheetsService.js";

export const recibirWebhookFormulario = async (req, res) => {
  try {
    const { correoEstudiante, proyectoId, datosAdicionales } = req.body;

    if (!correoEstudiante || !proyectoId) {
      return res.status(400).json({
        msg: "Faltan datos requeridos: correoEstudiante y proyectoId son obligatorios"
      });
    }

    const estudiante = await Usuario.findOne({ correo: correoEstudiante, rol: "usuario" });
    if (!estudiante) {
      return res.status(404).json({
        msg: "Estudiante no encontrado con ese correo"
      });
    }

    const proyecto = await Proyecto.findById(proyectoId);
    if (!proyecto) {
      return res.status(404).json({
        msg: "Proyecto no encontrado"
      });
    }

    if (!proyecto.activo) {
      return res.status(400).json({
        msg: "El proyecto no está activo"
      });
    }

    const aplicacionExistente = await Aplicacion.findOne({
      estudiante: estudiante._id,
      proyecto: proyectoId
    });

    if (aplicacionExistente) {
      return res.status(400).json({
        msg: "El estudiante ya aplicó a este proyecto"
      });
    }

    const nuevaAplicacion = new Aplicacion({
      estudiante: estudiante._id,
      proyecto: proyectoId,
      estado: "Pendiente",
      datosAdicionales: datosAdicionales || {}
    });

    await nuevaAplicacion.save();

    const aplicacionPopulada = await Aplicacion.findById(nuevaAplicacion._id)
      .populate("estudiante", "nombre correo")
      .populate("proyecto", "titulo");

    try {
      await agregarFilaAplicacion({
        id: aplicacionPopulada._id.toString(),
        nombreEstudiante: aplicacionPopulada.estudiante.nombre,
        correoEstudiante: aplicacionPopulada.estudiante.correo,
        tituloProyecto: aplicacionPopulada.proyecto.titulo,
        estado: aplicacionPopulada.estado,
        fechaSumision: aplicacionPopulada.fechaSumision.toISOString()
      });
    } catch (sheetsError) {
      console.error("Error al registrar en Google Sheets:", sheetsError.message);
    }

    res.status(201).json({
      msg: "Aplicación registrada exitosamente desde webhook",
      data: aplicacionPopulada
    });

  } catch (error) {
    console.error("Error en webhook:", error);
    res.status(500).json({
      msg: "Error al procesar webhook",
      error: error.message
    });
  }
};

export const verificarWebhook = (req, res) => {
  const { challenge } = req.query;
  
  if (challenge) {
    return res.status(200).send(challenge);
  }
  
  res.status(200).json({
    msg: "Webhook activo y funcionando",
    timestamp: new Date().toISOString()
  });
};
