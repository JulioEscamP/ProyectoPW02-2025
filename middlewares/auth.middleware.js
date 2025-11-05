import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';

export const checkJwt = async (req, res, next) => {
  let token;
  // El token es de tipo Bearer y viene en el header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Se verifica el token usando la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Adjunta el usuario al request sin la contraseña
      req.usuario = await Usuario.findById(decoded.id).select('-contraseña');

      if (!req.usuario) {
         return res.status(401).json({ msg: 'Usuario no encontrado.' });
      }

      next();
    } catch (error) {
      console.error('Error de autenticación:', error.message);
      return res.status(401).json({ msg: 'Token inválido.' });
    }
  }

  if (!token) {
    return res.status(401).json({ msg: 'Token no existente.' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'admin') {
    next(); // Check que el user es admin
  } else {
    return res.status(403).json({ msg: 'Acceso denegado.' });
  }
};
