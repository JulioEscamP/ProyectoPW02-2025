import mongoose from 'mongoose';
import 'dotenv/config'; 

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('>>> MongoDB conectado exitosamente');
  } catch (error) {
    console.error(`Error al conectar con MongoDB: ${error.message}`);
    process.exit(1); 
  }
};

export default conectarDB;