import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true, 
  },
  correo: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true,
    trim: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    required: true,
    enum: ['usuario', 'admin'], 
    default: 'usuario',
  },
  
}, {
  timestamps: true 
});

// Middleware
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) {
    return next();
  }
  
  // Salt = NUmero randow unico.
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
export default Usuario;