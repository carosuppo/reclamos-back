import prisma from '../../src/lib/db';

async function main() {
  /*Borramos los tipos de reclamo con sus reclamos y su historial de estado
    Necesitamos borrar lo demás, porque sino habrán reclamos y estados con relaciones que no existen*/
  await prisma.cambioEstado.deleteMany({});
  await prisma.reclamo.deleteMany({});
  await prisma.tipoReclamo.deleteMany({});

  const tipos = await prisma.tipoReclamo.createMany({
    data: [
      {
        nombre: 'Solicitud de Modificación del Proyecto',
        descripcion:
          'Requerimientos orientados a realizar cambios en elementos existentes del proyecto.',
      },
      {
        nombre: 'Solicitud de Ampliación del Proyecto',
        descripcion:
          'Requerimientos para agregar nuevas funcionalidades, módulos o componentes al proyecto.',
      },
      {
        nombre: 'Error Técnico',
        descripcion:
          'Fallas o problemas técnicos detectados durante la ejecución del proyecto.',
      },
      {
        nombre: 'Otros',
        descripcion:
          'Reclamos que no se encuentran dentro de las categorías principales.',
      },
    ],
  });

  console.log(`Se crearon ${tipos.count} tipos de reclamo`);
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
