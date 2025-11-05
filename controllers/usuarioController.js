import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";

// TODO revisar esto
const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    let usuario = await Usuario.findOne({ correo }).select("+contraseña");
    if (usuario) {
      return res
        .status(400)
        .json({ msg: "Error: El correo ya está registrado." });
    }

    usuario = new Usuario(req.body);

    await usuario.save();

    res.status(201).json({ msg: "Usuario creado exitosamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error en el servidor." });
  }
};

const loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findOne({ correo }).select("+contraseña");
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado." });
    }

    // Verificar la contraseña
    const passwordCorrecto = await usuario.comprobarContraseña(contraseña);
    if (!passwordCorrecto) {
      return res.status(401).json({ msg: "Contraseña incorrecta." });
    }
  
    // Crear y firmar el JWT
    const payload = {
      id: usuario._id,
      nombre: usuario.nombre,
      rol: usuario.rol,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    // Responder al cliente con el token
    res.status(200).json({
      msg: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error en el servidor." });
  }
};

const getPerfil = async (req, res) => {
  try {
    res.status(200).json(req.usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Hubo un error al obtener el perfil.' });
  }
};

export {
  registrarUsuario,
  loginUsuario,
  getPerfil,
};
