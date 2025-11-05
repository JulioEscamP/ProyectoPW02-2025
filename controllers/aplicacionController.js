import Aplicacion from "../models/Aplicacion.js";
import Proyecto from "../models/Proyecto.js";

export const createAplicacion = async (req, res) => {
  try {
    const { proyectoId } = req.body;
    const estudianteId = req.usuario.id;

    // Verifica que el proyecto existe y está activo
    const proyecto = await Proyecto.findById(proyectoId);
    if (!proyecto || !proyecto.activo) {
      return res
        .status(404)
        .json({ msg: "El proyecto no existe o no está activo." });
    }

    // Verifica que el usuario sea un estudiante
    if (req.usuario.rol !== "usuario") {
      return res
        .status(403)
        .json({ msg: "Los administradores no pueden aplicar a proyectos." });
    }

    // Crea la aplicación
    const aplicacion = new Aplicacion({
      proyecto: proyectoId,
      estudiante: estudianteId,
    });

    await aplicacion.save();

    //TODO integrar ms graph api para registrar en excel

    res
      .status(201)
      .json({ msg: "Aplicación registrada exitosamente.", data: aplicacion });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ msg: "Error: Ya has aplicado a este proyecto." });
    }
    console.error(error);
    res.status(500).json({ msg: "Error al registrar la aplicación." });
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
