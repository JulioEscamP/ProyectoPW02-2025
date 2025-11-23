import mongoose from "mongoose";

const aplicacionSchema = new mongoose.Schema(
  {
    proyecto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },
    estudiante: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    motivacion: { // Viene de formData.motivation (FrontEnd)
      type: String,
    },
    terminosAceptados: { // Viene de formData.acceptedTerms (FrontEnd)
      type: Boolean,
      default: false,
    },
    estado: {
      type: String,
      enum: ["Pendiente", "Aprobada", "Rechazada"],
      default: "Pendiente",
    },
    fechaSumision: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Evita que un estudiante aplique varias veces al mismo proyecto
aplicacionSchema.index({ proyecto: 1, estudiante: 1 }, { unique: true });

const Aplicacion = mongoose.model("Aplicacion", aplicacionSchema);
export default Aplicacion;
