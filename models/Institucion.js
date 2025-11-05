import mongoose from "mongoose";

const institucionSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    direccion: {
      type: String,
      trim: true,
    },
    correo: {
      type: String,
      lowercase: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, 
  }
);

const Institucion = mongoose.model("Institucion", institucionSchema);
export default Institucion;
