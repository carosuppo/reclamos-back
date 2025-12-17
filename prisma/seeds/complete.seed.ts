import prisma from '../../src/lib/db';
import * as bcrypt from 'bcrypt';
import { Estados } from '@prisma/client';
import { Medidas } from 'src/common/enums/medidas.enum';

async function main() {
  console.log('🌱 Iniciando seed completo de la base de datos...\n');

  // Limpiar todas las tablas en orden inverso de dependencias
  console.log('🧹 Limpiando datos existentes...');
  await prisma.cambioEstado.deleteMany({});
  await prisma.reclamo.deleteMany({});
  await prisma.proyecto.deleteMany({});
  await prisma.empleado.deleteMany({});
  await prisma.cliente.deleteMany({});
  await prisma.area.deleteMany({});
  await prisma.tipoReclamo.deleteMany({});
  await prisma.tipoProyecto.deleteMany({});

  // ═══════════════════════════════════════════════════════════════
  // 🔑 CONTRASEÑA PARA TODOS LOS USUARIOS: password123
  // ═══════════════════════════════════════════════════════════════
  const PASSWORD_PLAIN = 'password123';
  const defaultPasswordHash = await bcrypt.hash(PASSWORD_PLAIN, 10);
  console.log(`🔑 Contraseña para TODOS los usuarios: ${PASSWORD_PLAIN}\n`);

  // 1. Crear Áreas
  console.log('📁 Creando áreas...');
  const areas = await prisma.area.createMany({
    data: [
      {
        nombre: 'Soporte Técnico',
        descripcion:
          'Área encargada de resolver problemas técnicos y brindar asistencia a clientes.',
      },
      {
        nombre: 'Desarrollo',
        descripcion:
          'Área responsable del desarrollo y mantenimiento de software.',
      },
      {
        nombre: 'Infraestructura',
        descripcion:
          'Área que gestiona servidores, redes y sistemas de hardware.',
      },
      {
        nombre: 'Calidad',
        descripcion:
          'Área encargada de asegurar la calidad de los productos y servicios.',
      },
      {
        nombre: 'Consultoría',
        descripcion:
          'Área que brinda asesoramiento técnico y estratégico a clientes.',
      },
    ],
  });
  console.log(`✅ Se crearon ${areas.count} áreas\n`);

  // Obtener las áreas creadas para usarlas en empleados
  const areasCreadas = await prisma.area.findMany();

  // 2. Crear Tipos de Proyecto
  console.log('📋 Creando tipos de proyecto...');
  const tiposProyecto = await prisma.tipoProyecto.createMany({
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
  console.log(`✅ Se crearon ${tiposProyecto.count} tipos de proyecto\n`);

  // Obtener los tipos de proyecto creados
  const tiposProyectoCreados = await prisma.tipoProyecto.findMany();

  // 3. Crear Tipos de Reclamo
  console.log('📝 Creando tipos de reclamo...');
  const tiposReclamo = await prisma.tipoReclamo.createMany({
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
  console.log(`✅ Se crearon ${tiposReclamo.count} tipos de reclamo\n`);

  // Obtener los tipos de reclamo creados
  const tiposReclamoCreados = await prisma.tipoReclamo.findMany();

  // 4. Crear Clientes
  console.log('👥 Creando clientes...');
  const clientes = await prisma.cliente.createMany({
    data: [
      {
        email: 'cliente1@example.com',
        contraseña: defaultPasswordHash,
        nombre: 'Juan Pérez',
        telefono: '+5491112345678',
        role: 'CLIENTE',
      },
      {
        email: 'cliente2@example.com',
        contraseña: defaultPasswordHash,
        nombre: 'María González',
        telefono: '+5491198765432',
        role: 'CLIENTE',
      },
      {
        email: 'cliente3@example.com',
        contraseña: defaultPasswordHash,
        nombre: 'Carlos Rodríguez',
        telefono: '+5491155512345',
        role: 'CLIENTE',
      },
      {
        email: 'cliente4@example.com',
        contraseña: defaultPasswordHash,
        nombre: 'Ana Martínez',
        telefono: '+5491166678901',
        role: 'CLIENTE',
      },
      {
        email: 'cliente5@example.com',
        contraseña: defaultPasswordHash,
        nombre: 'Luis Fernández',
        telefono: '+5491177789012',
        role: 'CLIENTE',
      },
    ],
  });
  console.log(`✅ Se crearon ${clientes.count} clientes\n`);

  // Obtener los clientes creados
  const clientesCreados = await prisma.cliente.findMany();

  // 5. Crear Empleados
  console.log('👔 Creando empleados...');
  const empleadosData = [
    {
      email: 'empleado1@example.com',
      contraseña: defaultPasswordHash,
      nombre: 'Pedro Sánchez',
      telefono: '+5491122233444',
      role: 'EMPLEADO',
      areaId: areasCreadas[0]?.id, // Soporte Técnico
    },
    {
      email: 'empleado2@example.com',
      contraseña: defaultPasswordHash,
      nombre: 'Laura Torres',
      telefono: '+5491133344555',
      role: 'EMPLEADO',
      areaId: areasCreadas[1]?.id, // Desarrollo
    },
    {
      email: 'empleado3@example.com',
      contraseña: defaultPasswordHash,
      nombre: 'Roberto Díaz',
      telefono: '+5491144455666',
      role: 'EMPLEADO',
      areaId: areasCreadas[2]?.id, // Infraestructura
    },
    {
      email: 'empleado4@example.com',
      contraseña: defaultPasswordHash,
      nombre: 'Sofía López',
      telefono: '+5491155566777',
      role: 'EMPLEADO',
      areaId: areasCreadas[3]?.id, // Calidad
    },
    {
      email: 'empleado5@example.com',
      contraseña: defaultPasswordHash,
      nombre: 'Diego Morales',
      telefono: '+5491166677888',
      role: 'EMPLEADO',
      areaId: areasCreadas[4]?.id, // Consultoría
    },
    {
      email: 'empleado6@example.com',
      contraseña: defaultPasswordHash,
      nombre: 'Carmen Ruiz',
      telefono: '+5491177788999',
      role: 'EMPLEADO',
      areaId: areasCreadas[0]?.id, // Soporte Técnico
    },
    {
      email: 'empleado7@example.com',
      contraseña: defaultPasswordHash,
      nombre: 'Fernando Castro',
      telefono: '+5491188899000',
      role: 'EMPLEADO',
      areaId: areasCreadas[1]?.id, // Desarrollo
    },
  ];

  const empleados = await prisma.empleado.createMany({
    data: empleadosData,
  });
  console.log(`✅ Se crearon ${empleados.count} empleados\n`);

  // Obtener los empleados creados
  const empleadosCreados = await prisma.empleado.findMany();

  // 6. Crear Proyectos
  console.log('🚀 Creando proyectos...');
  const proyectosData = [
    {
      clienteId: clientesCreados[0]?.id,
      tipoProyectoId: tiposProyectoCreados[0]?.id, // Desarrollo de Software
      nombre: 'Sistema de Gestión de Reclamos',
      descripcion: 'Plataforma web para gestionar reclamos de clientes.',
    },
    {
      clienteId: clientesCreados[0]?.id,
      tipoProyectoId: tiposProyectoCreados[1]?.id, // Infraestructura Tecnológica
      nombre: 'Migración a la Nube',
      descripcion: 'Migración de servidores locales a infraestructura cloud.',
    },
    {
      clienteId: clientesCreados[1]?.id,
      tipoProyectoId: tiposProyectoCreados[0]?.id, // Desarrollo de Software
      nombre: 'Aplicación Móvil E-commerce',
      descripcion: 'Desarrollo de aplicación móvil para ventas online.',
    },
    {
      clienteId: clientesCreados[1]?.id,
      tipoProyectoId: tiposProyectoCreados[2]?.id, // Consultoría Tecnológica
      nombre: 'Auditoría de Seguridad',
      descripcion: 'Evaluación de seguridad de sistemas existentes.',
    },
    {
      clienteId: clientesCreados[2]?.id,
      tipoProyectoId: tiposProyectoCreados[3]?.id, // Soporte Técnico
      nombre: 'Contrato de Soporte Anual',
      descripcion: 'Servicio de soporte técnico durante un año.',
    },
    {
      clienteId: clientesCreados[2]?.id,
      tipoProyectoId: tiposProyectoCreados[0]?.id, // Desarrollo de Software
      nombre: 'Dashboard Analítico',
      descripcion: 'Panel de control con métricas y análisis de datos.',
    },
    {
      clienteId: clientesCreados[3]?.id,
      tipoProyectoId: tiposProyectoCreados[4]?.id, // Investigación y Desarrollo
      nombre: 'Proyecto de IA para Automatización',
      descripcion: 'Investigación sobre inteligencia artificial aplicada.',
    },
    {
      clienteId: clientesCreados[4]?.id,
      tipoProyectoId: tiposProyectoCreados[1]?.id, // Infraestructura Tecnológica
      nombre: 'Redundancia de Servidores',
      descripcion:
        'Implementación de servidores redundantes para alta disponibilidad.',
    },
  ];

  const proyectos = await prisma.proyecto.createMany({
    data: proyectosData,
  });
  console.log(`✅ Se crearon ${proyectos.count} proyectos\n`);

  // Obtener los proyectos creados
  const proyectosCreados = await prisma.proyecto.findMany();

  // 7. Crear Reclamos
  console.log('📢 Creando reclamos...');
  const reclamosData = [
    {
      tipoReclamoId: tiposReclamoCreados[0]?.id, // Solicitud de Modificación
      proyectoId: proyectosCreados[0]?.id,
      estado: Estados.PENDIENTE,
      prioridad: Medidas.ALTA,
      criticidad: Medidas.ALTA,
      descripcion:
        'Necesito modificar el formulario de reclamos para incluir un campo adicional de categoría.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[1]?.id, // Solicitud de Ampliación
      proyectoId: proyectosCreados[0]?.id,
      estado: Estados.EN_PROCESO,
      prioridad: Medidas.MEDIA,
      criticidad: Medidas.ALTA,
      descripcion:
        'Solicito agregar funcionalidad de notificaciones por email cuando se actualiza un reclamo.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[2]?.id, // Error Técnico
      proyectoId: proyectosCreados[1]?.id,
      estado: Estados.PENDIENTE,
      prioridad: Medidas.ALTA,
      criticidad: Medidas.ALTA,
      descripcion:
        'El sistema de migración falla al transferir archivos mayores a 1GB.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[0]?.id, // Solicitud de Modificación
      proyectoId: proyectosCreados[2]?.id,
      estado: Estados.RESUELTO,
      prioridad: Medidas.BAJA,
      criticidad: Medidas.MEDIA,
      descripcion: 'Cambiar el color del botón de pago en la aplicación móvil.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[2]?.id, // Error Técnico
      proyectoId: proyectosCreados[2]?.id,
      estado: Estados.EN_PROCESO,
      prioridad: Medidas.ALTA,
      criticidad: Medidas.ALTA,
      descripcion:
        'La aplicación se cierra inesperadamente al procesar pagos con tarjeta de crédito.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[1]?.id, // Solicitud de Ampliación
      proyectoId: proyectosCreados[3]?.id,
      estado: Estados.PENDIENTE,
      prioridad: Medidas.MEDIA,
      criticidad: Medidas.MEDIA,
      descripcion:
        'Agregar reporte de vulnerabilidades encontradas en formato PDF.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[3]?.id, // Otros
      proyectoId: proyectosCreados[4]?.id,
      estado: Estados.RESUELTO,
      prioridad: Medidas.BAJA,
      criticidad: Medidas.BAJA,
      descripcion:
        'Solicito información sobre los horarios de atención del soporte técnico.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[0]?.id, // Solicitud de Modificación
      proyectoId: proyectosCreados[5]?.id,
      estado: Estados.EN_PROCESO,
      prioridad: Medidas.MEDIA,
      criticidad: Medidas.ALTA,
      descripcion:
        'Modificar el formato de las gráficas en el dashboard para mejorar la visualización.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[2]?.id, // Error Técnico
      proyectoId: proyectosCreados[6]?.id,
      estado: Estados.PENDIENTE,
      prioridad: Medidas.ALTA,
      criticidad: Medidas.ALTA,
      descripcion:
        'El algoritmo de IA no está aprendiendo correctamente de los datos de entrenamiento.',
    },
    {
      tipoReclamoId: tiposReclamoCreados[1]?.id, // Solicitud de Ampliación
      proyectoId: proyectosCreados[7]?.id,
      estado: Estados.RESUELTO,
      prioridad: Medidas.MEDIA,
      criticidad: Medidas.MEDIA,
      descripcion:
        'Agregar monitoreo en tiempo real del estado de los servidores.',
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

    const baseDate =
      Date.now() - (reclamosCreados.length - i) * 24 * 60 * 60 * 1000;

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
  console.log(`   - ${areas.count} áreas`);
  console.log(`   - ${tiposProyecto.count} tipos de proyecto`);
  console.log(`   - ${tiposReclamo.count} tipos de reclamo`);
  console.log(`   - ${clientes.count} clientes`);
  console.log(`   - ${empleados.count} empleados`);
  console.log(`   - ${proyectos.count} proyectos`);
  console.log(`   - ${reclamos.count} reclamos`);
  console.log(`   - ${cambiosEstado.count} cambios de estado`);
  console.log('\n✅ Seed completado con éxito! 🎉');
  console.log('\n' + '═'.repeat(60));
  console.log('📝 CREDENCIALES DE PRUEBA');
  console.log('═'.repeat(60));
  console.log(`\n🔑 Contraseña para TODOS los usuarios: ${PASSWORD_PLAIN}\n`);

  console.log('👥 CLIENTES:');
  clientesCreados.forEach((cliente, index) => {
    console.log(
      `   ${index + 1}. Email: ${cliente.email} | Contraseña: ${PASSWORD_PLAIN}`,
    );
  });

  console.log('\n👔 EMPLEADOS:');
  empleadosCreados.forEach((empleado, index) => {
    const areaNombre =
      areasCreadas.find((a) => a.id === empleado.areaId)?.nombre || 'Sin área';
    console.log(
      `   ${index + 1}. Email: ${empleado.email} | Contraseña: ${PASSWORD_PLAIN} | Área: ${areaNombre}`,
    );
  });

  console.log('\n' + '═'.repeat(60));
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
