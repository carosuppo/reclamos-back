import { Injectable } from '@nestjs/common';
import { Empleado } from '@prisma/client';
import prisma from '../../lib/db';
import {
  EmpleadoCreateData,
  EmpleadoUpdateData,
} from '../interfaces/empleado.interface';
import { IEmpleadoRepository } from './empleado.repository.interface';

@Injectable()
export class EmpleadoRepository implements IEmpleadoRepository {
  async create(data: EmpleadoCreateData): Promise<Empleado> {
    return await prisma.empleado.create({ data });
  }

  async update(data: EmpleadoUpdateData): Promise<Empleado> {
    return prisma.empleado.update({
      where: { id: data.id },
      data: {
        nombre: data?.nombre,
        email: data?.email,
        telefono: data?.telefono,
      },
    });
  }

  async assignArea(id: string, areaId: string): Promise<Empleado> {
    return await prisma.empleado.update({
      where: { id },
      data: { areaId },
    });
  }

  async findById(id: string): Promise<Empleado | null> {
    return await prisma.empleado.findFirst({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findByEmail(email: string): Promise<Empleado | null> {
    return await prisma.empleado.findFirst({
      where: {
        email,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.empleado.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
