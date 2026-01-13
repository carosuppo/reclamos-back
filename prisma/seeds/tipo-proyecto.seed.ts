import prisma from '../../src/lib/db';

async function main() {
  /*Borramos los tipos de proyecto con sus proyectos
    Necesitamos borrar los proyectos, porque sino habrán proyectos con tipos de proyecto que no existen*/
  await prisma.cambioEstado.deleteMany({});
  await prisma.reclamo.deleteMany({});
  await prisma.proyecto.deleteMany({});
  await prisma.tipoProyecto.deleteMany({});

  const tipos = await prisma.tipoProyecto.createMany({
    data: [
      {
        nombre: 'Desarrollo de Software',
        descripcion: 'Proyectos de creación de aplicaciones y sistemas.',
      },
      {
        nombre: 'Infraestructura Tecnológica',
        descripcion: 'Proyectos de redes, servidores y hardware.',
      },
      {
        nombre: 'Consultoría Tecnológica',
        descripcion: 'Servicios de asesoramiento y planificación tecnológica.',
      },
      {
        nombre: 'Soporte Técnico',
        descripcion: 'Atención y resolución de incidencias técnicas.',
      },
      {
        nombre: 'Investigación y Desarrollo',
        descripcion: 'Proyectos orientados a innovación tecnológica.',
      },
    ],
  });

  console.log(`Se crearon ${tipos.count} tipos de proyecto`);

  console.log('Seed completado con éxito');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
