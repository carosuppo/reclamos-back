import prisma from '../../src/lib/db';
import { Estados } from '@prisma/client';
import { Medidas } from 'src/common/enums/medidas.enum';

async function main() {
  console.log('🌱 Iniciando seed completo de la base de datos...\n');

  const randomDateWithinMonths = (months: number) => {
    const now = new Date();
    const maxDays = Math.max(1, Math.floor(months * 30));
    const dayOffset = Math.floor(Math.random() * maxDays) + 1;
    const result = new Date(now);
    result.setDate(now.getDate() - dayOffset);
    return result;
  };

  // Limpiar solo reclamos y cambios de estado
  console.log('🧹 Limpiando reclamos y cambios de estado existentes...');
  await prisma.cambioEstado.deleteMany({});
  await prisma.reclamo.deleteMany({});

  const areasCreadas = await prisma.area.findMany();
  const tiposReclamoCreados = await prisma.tipoReclamo.findMany();
  const clientesCreados = await prisma.cliente.findMany();
  const empleadosCreados = await prisma.empleado.findMany();
  const proyectosCreados = await prisma.proyecto.findMany();

  if (
    areasCreadas.length === 0 ||
    tiposReclamoCreados.length === 0 ||
    clientesCreados.length === 0 ||
    empleadosCreados.length === 0 ||
    proyectosCreados.length === 0
  ) {
    throw new Error(
      'Faltan datos base (areas, tipos de reclamo, clientes, empleados o proyectos).',
    );
  }

  // 7. Crear Reclamos
  console.log('📢 Creando reclamos...');
  const reclamosBaseDates = Array.from(
    { length: 20 },
    () => randomDateWithinMonths(4),
  ).sort((a, b) => a.getTime() - b.getTime());
  const reclamosData = [
    {
      tipoReclamoId: tiposReclamoCreados[0]?.id, // Solicitud de Modificación
      proyectoId: proyectosCreados[0]?.id,
      estado: Estados.PENDIENTE,
      prioridad: Medidas.ALTA,
      criticidad: Medidas.ALTA,
      descripcion:
        'Necesito modificar el formulario de reclamos para incluir un campo adicional de categoría.',
      createdAt: reclamosBaseDates[0],
    },
    {
      tipoReclamoId: tiposReclamoCreados[1]?.id, // Solicitud de Ampliación
      proyectoId: proyectosCreados[0]?.id,
      estado: Estados.EN_PROCESO,
      prioridad: Medidas.MEDIA,
      criticidad: Medidas.ALTA,
      descripcion:
        'Solicito agregar funcionalidad de notificaciones por email cuando se actualiza un reclamo.',
      createdAt: reclamosBaseDates[1],
    },
    {
      tipoReclamoId: tiposReclamoCreados[2]?.id, // Error Técnico
      proyectoId: proyectosCreados[1]?.id,
      estado: Estados.PENDIENTE,
      prioridad: Medidas.ALTA,
      criticidad: Medidas.ALTA,
      descripcion:
        'El sistema de migración falla al transferir archivos mayores a 1GB.',
      createdAt: reclamosBaseDates[2],
    },
    {
      tipoReclamoId: tiposReclamoCreados[0]?.id, // Solicitud de Modificación
      proyectoId: proyectosCreados[2]?.id,
      estado: Estados.RESUELTO,
      prioridad: Medidas.BAJA,
      criticidad: Medidas.MEDIA,
      descripcion: 'Cambiar el color del botón de pago en la aplicación móvil.',
      createdAt: reclamosBaseDates[3],
    },
    {
      tipoReclamoId: tiposReclamoCreados[2]?.id, // Error Técnico
      proyectoId: proyectosCreados[2]?.id,
      estado: Estados.EN_PROCESO,
      prioridad: Medidas.ALTA,
      criticidad: Medidas.ALTA,
      descripcion:
        'La aplicación se cierra inesperadamente al procesar pagos con tarjeta de crédito.',
      createdAt: reclamosBaseDates[4],
    },
    {
      tipoReclamoId: tiposReclamoCreados[1]?.id, // Solicitud de Ampliación
      proyectoId: proyectosCreados[3]?.id,
      estado: Estados.PENDIENTE,
      prioridad: Medidas.MEDIA,
      criticidad: Medidas.MEDIA,
      descripcion:
        'Agregar reporte de vulnerabilidades encontradas en formato PDF.',
      createdAt: reclamosBaseDates[5],
    },
    {
      tipoReclamoId: tiposReclamoCreados[3]?.id, // Otros
      proyectoId: proyectosCreados[4]?.id,
      estado: Estados.RESUELTO,
      prioridad: Medidas.BAJA,
      criticidad: Medidas.BAJA,
      descripcion:
        'Solicito información sobre los horarios de atención del soporte técnico.',
      createdAt: reclamosBaseDates[6],
    },
    {
      tipoReclamoId: tiposReclamoCreados[0]?.id, // Solicitud de Modificación
      proyectoId: proyectosCreados[5]?.id,
      estado: Estados.EN_PROCESO,
      prioridad: Medidas.MEDIA,
      criticidad: Medidas.ALTA,
      descripcion:
        'Modificar el formato de las gráficas en el dashboard para mejorar la visualización.',
      createdAt: reclamosBaseDates[7],
    },
    {
      tipoReclamoId: tiposReclamoCreados[2]?.id, // Error Técnico
      proyectoId: proyectosCreados[6]?.id,
      estado: Estados.PENDIENTE,
      prioridad: Medidas.ALTA,
      criticidad: Medidas.ALTA,
      descripcion:
        'El algoritmo de IA no está aprendiendo correctamente de los datos de entrenamiento.',
      createdAt: reclamosBaseDates[8],
    },
    {
      tipoReclamoId: tiposReclamoCreados[1]?.id, // Solicitud de Ampliación
      proyectoId: proyectosCreados[7]?.id,
      estado: Estados.RESUELTO,
      prioridad: Medidas.MEDIA,
      criticidad: Medidas.MEDIA,
      descripcion:
        'Agregar monitoreo en tiempo real del estado de los servidores.',
      createdAt: reclamosBaseDates[9],
    },
  ];

  const reclamos = await prisma.reclamo.createMany({
    data: reclamosData,
  });
  console.log(`✅ Se crearon ${reclamos.count} reclamos\n`);

  // Obtener los reclamos creados
  const reclamosCreados = await prisma.reclamo.findMany();

  // 8. Crear Cambios de Estado
  console.log('🔄 Creando cambios de estado...');
  const cambiosEstadoData: Array<{
    reclamoId: string;
    clienteId: string | null;
    empleadoId: string | null;
    areaId: string;
    estado: Estados;
    descripcion: string;
    fechaInicio: Date;
    fechaFin?: Date | null;
  }> = [];

  for (let i = 0; i < reclamosCreados.length; i++) {
    const reclamo = reclamosCreados[i];
    const cliente = clientesCreados[i % clientesCreados.length];
    const empleado = empleadosCreados[i % empleadosCreados.length];

    const area = empleado.areaId
      ? areasCreadas.find((a) => a.id === empleado.areaId) || areasCreadas[0]
      : areasCreadas[0];

    const baseDate = reclamo.createdAt ?? reclamosBaseDates[i];

    // 🟡 PENDIENTE (siempre existe y SIEMPRE se cierra si hay otro estado)
    const pendienteInicio = new Date(baseDate);
    const pendienteFin =
      reclamo.estado === Estados.PENDIENTE
        ? null
        : new Date(pendienteInicio.getTime() + 4 * 60 * 60 * 1000);

    cambiosEstadoData.push({
      reclamoId: reclamo.id,
      clienteId: cliente.id,
      empleadoId: null,
      areaId: area.id,
      estado: Estados.PENDIENTE,
      descripcion: 'Reclamo creado por el cliente.',
      fechaInicio: pendienteInicio,
      fechaFin: pendienteFin,
    });

    // 🔵 EN_PROCESO
    if (
      reclamo.estado === Estados.EN_PROCESO ||
      reclamo.estado === Estados.RESUELTO
    ) {
      const enProcesoInicio = new Date(
        pendienteInicio.getTime() + 5 * 60 * 60 * 1000,
      );

      const enProcesoFin =
        reclamo.estado === Estados.EN_PROCESO
          ? null
          : new Date(enProcesoInicio.getTime() + 6 * 60 * 60 * 1000);

      cambiosEstadoData.push({
        reclamoId: reclamo.id,
        clienteId: null,
        empleadoId: empleado.id,
        areaId: area.id,
        estado: Estados.EN_PROCESO,
        descripcion: 'Reclamo asignado a área y en proceso de resolución.',
        fechaInicio: enProcesoInicio,
        fechaFin: enProcesoFin,
      });
    }

    // 🟢 RESUELTO (SIEMPRE es el último y NO tiene fechaFin)
    if (reclamo.estado === Estados.RESUELTO) {
      const resueltoInicio = new Date(
        pendienteInicio.getTime() + 12 * 60 * 60 * 1000,
      );

      cambiosEstadoData.push({
        reclamoId: reclamo.id,
        clienteId: null,
        empleadoId: empleado.id,
        areaId: area.id,
        estado: Estados.RESUELTO,
        descripcion: 'Reclamo resuelto satisfactoriamente.',
        fechaInicio: resueltoInicio,
        fechaFin: null,
      });
    }
  }

  const cambiosEstado = await prisma.cambioEstado.createMany({
    data: cambiosEstadoData,
  });

  console.log(`✅ Se crearon ${cambiosEstado.count} cambios de estado\n`);

  // Resumen final
  console.log('📊 Resumen del seed:');
  console.log(`   - ${reclamos.count} reclamos`);
  console.log(`   - ${cambiosEstado.count} cambios de estado`);
  console.log('\n✅ Seed completado con éxito! 🎉');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
