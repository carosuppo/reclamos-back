import * as bcrypt from 'bcrypt';
import { Medidas } from '../../src/common/enums/medidas.enum';
import { Role } from '../../src/common/enums/role.enum';
import prisma from '../../src/lib/db';

export const buildEmail = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;

export const buildName = (prefix: string) =>
  `${prefix}-${Math.random().toString(16).slice(2, 8)}`;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function createCliente(password: string) {
  const email = buildEmail('cliente');
  const cliente = await prisma.cliente.create({
    data: {
      nombre: buildName('Cliente'),
      email,
      contraseña: await hashPassword(password),
      telefono: '123',
      role: Role.CLIENTE,
    },
  });

  return { cliente, email };
}

export async function createEmpleado(password: string, areaId?: string) {
  const email = buildEmail('empleado');
  const empleado = await prisma.empleado.create({
    data: {
      nombre: buildName('Empleado'),
      email,
      contraseña: await hashPassword(password),
      telefono: '123',
      role: Role.EMPLEADO,
      areaId,
    },
  });

  return { empleado, email };
}

export async function createArea() {
  return prisma.area.create({
    data: { nombre: buildName('Area') },
  });
}

export async function createTipoReclamo() {
  return prisma.tipoReclamo.create({
    data: { nombre: buildName('TipoReclamo') },
  });
}

export async function createTipoProyecto() {
  return prisma.tipoProyecto.create({
    data: { nombre: buildName('TipoProyecto') },
  });
}

export async function createProyecto(
  clienteId: string,
  tipoProyectoId: string,
) {
  return prisma.proyecto.create({
    data: {
      nombre: buildName('Proyecto'),
      clienteId,
      tipoProyectoId,
    },
  });
}

export async function createReclamo(params: {
  tipoReclamoId: string;
  proyectoId: string;
  prioridad?: Medidas;
  criticidad?: Medidas;
  descripcion?: string;
}) {
  return prisma.reclamo.create({
    data: {
      tipoReclamoId: params.tipoReclamoId,
      proyectoId: params.proyectoId,
      estado: 'PENDIENTE',
      prioridad: params.prioridad ?? Medidas.MEDIA,
      criticidad: params.criticidad ?? Medidas.MEDIA,
      descripcion: params.descripcion ?? 'Reclamo de prueba',
    },
  });
}
