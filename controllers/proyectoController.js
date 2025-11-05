import Proyecto from "../models/Proyecto.js";
import Institucion from "../models/Institucion.js";

export const createProyecto = async (req, res) => {
  try {
    const { titulo, descripcion, institucionId } = req.body;

    // Verificar que la institución exista
    const institucion = await Institucion.findById(institucionId);
    if (!institucion) {
      return res
        .status(404)
        .json({ msg: "La institución especificada no existe." });
    }

    // Se crea el proyecto
    const proyecto = new Proyecto({
      titulo,
      descripcion,
      institucion: institucionId,
      publicadoPor: req.usuario.id, // lo obtenemos del token
    });

    await proyecto.save();

    res
      .status(201)
      .json({ msg: "Proyecto creado exitosamente", data: proyecto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor al crear el proyecto." });
  }
};

export const getProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find({ activo: true })
      .populate("institucion", "nombre correo telefono")
      .populate("publicadoPor", "nombre");

    res.status(200).json(proyectos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener los proyectos." });
  }
};

export const updateProyecto = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, institucionId, activo } = req.body;

    // Verificar si el proyecto existe
    let proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado." });
    }

    // Actualizar campos si vienen en el body
    proyecto.titulo = titulo || proyecto.titulo;
    proyecto.descripcion = descripcion || proyecto.descripcion;
    // Marca como activo/inactivo
    if (activo !== undefined) {
      proyecto.activo = activo;
    }

    // Verificar que existe la institución si se proporciona una nueva
    if (institucionId) {
      const institucion = await Institucion.findById(institucionId);
      if (!institucion) {
        return res
          .status(404)
          .json({ msg: "La institución especificada no existe." });
      }
      proyecto.institucion = institucionId;
    }

    const proyectoActualizado = await proyecto.save();
    res
      .status(200)
      .json({ msg: "Proyecto actualizado", data: proyectoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar el proyecto." });
  }
};

export const deleteProyecto = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el proyecto existe
    const proyecto = await Proyecto.findById(id);
    if (!proyecto) {
      return res.status(404).json({ msg: "Proyecto no encontrado." });
    }

    // Marcar como inactivo en vez de borrarlo completamente
    proyecto.activo = false;
    await proyecto.save();

    res.status(200).json({ msg: "Proyecto marcado como inactivo." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar el proyecto." });
  }
};
