import 'dotenv/config';
import mongoose from 'mongoose';
import conectarDB from '../config/db.js';
import { usuarios, instituciones } from './data.js';
import Usuario from '../models/Usuario.js';
import Institucion from '../models/Institucion.js';
import Proyecto from '../models/Proyecto.js';
import Aplicacion from '../models/Aplicacion.js';

const importData = async () => {
  try {
    // Borrar todos loo datos de la bd
    await Aplicacion.deleteMany();
    await Proyecto.deleteMany();
    await Institucion.deleteMany();
    await Usuario.deleteMany();

    console.log('Datos previos eliminados...');

    // Insertar (todos son datos quemados)
    const createdUsers = await Usuario.create(usuarios);
    const createdInstituciones = await Institucion.insertMany(instituciones);

    // Id del admin
    const adminUser = createdUsers.find(u => u.rol === 'admin')._id;
    // Ids de los estudiantes
    const studentUser1 = createdUsers.find(u => u.correo === 'juan@uca.edu.sv')._id;
    const studentUser2 = createdUsers.find(u => u.correo === 'pedro@uca.edu.sv')._id;
    // Ids de instituciones
    const inst1 = createdInstituciones[0]._id;
    const inst2 = createdInstituciones[1]._id;
    const inst3 = createdInstituciones[2]._id;
    //?console.log('ID de instituciones:', inst1, inst2, inst3);

    // Datos de proyectos
    const proyectos = [
      {
        titulo: "Colecta Nacional Cruz Roja",
        descripcion: "Apoyo logístico en la colecta anual de la Cruz Roja. Se necesita personal para stands y recolección.",
        institucion: inst2,
        publicadoPor: adminUser,
      },
      {
        titulo: "Apoyo Escolar en Fundación Ayúdame a Vivir",
        descripcion: "Tutorías de matemáticas y lenguaje para niños en tratamiento. Se requiere paciencia y dedicación.",
        institucion: inst1,
        publicadoPor: adminUser,
      },
      {
        titulo: "Construcción de Viviendas Techo",
        descripcion: "Participa en la construcción de viviendas de emergencia en comunidades vulnerables.",
        institucion: inst3,
        publicadoPor: adminUser,
      },
    ];

    const createdProyectos = await Proyecto.insertMany(proyectos);

    // Datos de aplicaciones
    const aplicaciones = [
      {
        proyecto: createdProyectos[0]._id, // Juan aplica a Cruz Roja
        estudiante: studentUser1,
        estado: 'Pendiente',
      },
      {
        proyecto: createdProyectos[1]._id, // Pedro aplica a Ayúdame a Vivir
        estudiante: studentUser2,
        estado: 'Aprobada',
      },
      {
        proyecto: createdProyectos[0]._id, // Pedro también aplica a Cruz Roja
        estudiante: studentUser2,
        estado: 'Rechazada',
      },
    ];

    await Aplicacion.insertMany(aplicaciones);

    console.log('Datos importados:');
    console.log('Admin: admin@uca.edu.sv');
    console.log('Estudiantes: juan@uca.edu.sv, pedro@uca.edu.sv');
    console.log('Contraseña (para todos): 123456');

  } catch (error) {
    console.error(`Error al importar datos: ${error.message}`);
    throw error;
  }
};

const deleteData = async () => {
  try {
    await Aplicacion.deleteMany();
    await Proyecto.deleteMany();
    await Institucion.deleteMany();
    await Usuario.deleteMany();

    console.log('Todos los datos han sido eliminados.');
  } catch (error) {
    console.error(`Error al eliminar datos: ${error.message}`);
    throw error;
  }
};

const main = async () => {
  try {
    await conectarDB();

    // Se escoge acción según argumento del cmd
    if (process.argv[2] === '-d') {
      await deleteData();
    } else {
      await importData();
    }

    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error(`Error en el script seeder: ${error.message}`);
    process.exit(1);
  }
};

main();
