import Institucion from "../models/Institucion.js";
import Proyecto from '../models/Proyecto.js';

export const createInstitucion = async (req, res) => {
  try {
    const { nombre, direccion, correo, telefono} = req.body;
    // console.log('Datos recibidos para crear institución:', { nombre, direccion, correo, telefono });
    // Verificar si la institución ya existe
    const institucion = await Institucion.findOne({ nombre });
    if (institucion) {
      return res
        .status(400)
        .json({ msg: "La institución con ese nombre ya existe." });
    }

    // Crear la institución
    const proyecto = new Institucion({
      nombre,
      direccion,
      correo,
      telefono
    });
    await proyecto.save();
    res
      .status(201)
      .json({ msg: "Institución creada exitosamente", data: proyecto });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error en el servidor al crear la institución." });
  }
};

export const getInstituciones = async (req, res) => {
  try {
    const instituciones = await Institucion.find();
    res.status(200).json(instituciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al obtener las instituciones." });
  }
};

export const updateInstitucion = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, correo, telefono } = req.body;

    // Verificar si la institución existe
    let institucion = await Institucion.findById(id);
    if (!institucion) {
      return res.status(404).json({ msg: "Institución no encontrada." });
    }

    // Actualizar campos
    institucion.nombre = nombre || institucion.nombre;
    institucion.direccion = direccion || institucion.direccion;
    institucion.correo = correo || institucion.correo;
    institucion.telefono = telefono || institucion.telefono;

    const institucionActualizada = await institucion.save();
    res
      .status(200)
      .json({ msg: "Institución actualizada", data: institucionActualizada });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al actualizar la institución." });
  }
};

//TODO delete institucion
export const deleteInstitucion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const proyectosAsociados = await Proyecto.countDocuments({ institucion: id });
    
    if (proyectosAsociados > 0) {
      return res.status(400).json({ 
        msg: "No se puede eliminar la institución porque tiene proyectos asociados",
        proyectosAsociados 
      });
    }
    
    const institucion = await Institucion.findByIdAndDelete(id);
    
    if (!institucion) {
      return res.status(404).json({ msg: "Institución no encontrada" });
    }
    
    res.status(200).json({ 
      msg: "Institución eliminada exitosamente",
      data: institucion 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al eliminar la institución" });
  }
};