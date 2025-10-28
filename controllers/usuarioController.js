import Usuario from '../models/Usuario.js';

// Registrar Usuario
const registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  try {
    let usuario = await Usuario.findOne({ correo });
    if (usuario) {
      return res.status(400).json({ msg: 'Error: El correo ya está registrado.' });
    }

    
    usuario = new Usuario(req.body);

    await usuario.save();

    res.status(201).json({ msg: 'Usuario creado exitosamente.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Hubo un error en el servidor.' });
  }
};

export {
  registrarUsuario
  // TODO: loginUsuario, 
  // TODO: obtenerPerfil (tentativa)??
};