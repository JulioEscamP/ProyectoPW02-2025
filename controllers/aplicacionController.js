import Aplicacion from "../models/Aplicacion.js";
import Proyecto from "../models/Proyecto.js";

export const createAplicacion = async (req, res) => {
  try {
    const {
      phone,      
      studentId,  // Ahora va al perfil de Usuario
      motivation, // Se queda en Aplicación
      socialHour, // ID del Proyecto
      acceptedTerms
    } = req.body;

    const estudianteId = req.usuario.id;

    // VALIDACIONES

    if (!socialHour) {
      return res.status(400).json({ msg: "Debe seleccionar un proyecto (Social Hour)." });
    }

    const proyecto = await Proyecto.findById(socialHour);
    if (!proyecto || !proyecto.activo) {
      return res.status(404).json({ msg: "El proyecto no existe o no está activo." });
    }

    if (req.usuario.rol !== "usuario") {
      return res.status(403).json({ msg: "Solo los estudiantes pueden aplicar." });
    }

    const aplicacionExistente = await Aplicacion.findOne({
      proyecto: socialHour,
      estudiante: estudianteId
    });

    if (aplicacionExistente) {
      return res.status(400).json({ msg: "Ya has enviado una aplicación para este proyecto." });
    }

    // ACTUALIZAR PERFIL DEL USUARIO (Carnet y Teléfono)
    
    const datosActualizarUsuario = {};
    if (studentId) datosActualizarUsuario.carnet = studentId;
    if (phone) datosActualizarUsuario.telefono = phone;

    if (Object.keys(datosActualizarUsuario).length > 0) {
      await Usuario.findByIdAndUpdate(estudianteId, datosActualizarUsuario);
    }

    // CREAR LA APLICACIÓN
    
    const nuevaAplicacion = new Aplicacion({
      proyecto: socialHour,
      estudiante: estudianteId,
      motivacion: motivation,
      terminosAceptados: acceptedTerms
    });

    await nuevaAplicacion.save();

    res.status(201).json({
      msg: "Aplicación enviada exitosamente.",
      data: nuevaAplicacion
    });

  } catch (error) {
    console.error("Error en createAplicacion:", error);
    
    // Manejo de errores de duplicados
    if (error.code === 11000) {
       return res.status(400).json({ msg: "Error: El carnet ingresado ya pertenece a otro usuario." });
    }

    res.status(500).json({ msg: "Hubo un error al procesar tu aplicación." });
  }
};

export const getAplicacionesPorProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const aplicaciones = await Aplicacion.find({ proyecto: id })
      .populate("estudiante", "nombre correo")
      .populate("proyecto", "titulo");

    res.status(200).json(aplicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las aplicaciones." });
  }
};

export const updateEstadoAplicacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    // Solo se puede cambiar a 'Aprobada' o 'Rechazada'
    if (!["Aprobada", "Rechazada"].includes(estado)) {
      return res
        .status(400)
        .json({ msg: "Estado no válido. Debe ser 'Aprobada' o 'Rechazada'." });
    }

    const aplicacion = await Aplicacion.findById(id);
    if (!aplicacion) {
      return res.status(404).json({ msg: "Aplicación no encontrada." });
    }

    // Solo actualiza si el estado no es igual al actual
    if (aplicacion.estado === estado) {
      return res
        .status(400)
        .json({
          msg: `La aplicación ya ha sido ${aplicacion.estado.toLowerCase()}.`,
        });
    }

    aplicacion.estado = estado;
    await aplicacion.save();

    res
      .status(200)
      .json({ msg: "Estado de la aplicación actualizado.", data: aplicacion });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la aplicación." });
  }
};

export const getMisAplicaciones = async (req, res) => {
  try {
    const estudianteId = req.usuario.id;
    const aplicaciones = await Aplicacion.find({
      estudiante: estudianteId,
    }).populate("proyecto", "titulo descripcion");

    res.status(200).json(aplicaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener tus aplicaciones." });
  }
};
