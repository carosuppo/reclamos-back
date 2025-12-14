import { Injectable } from '@nestjs/common';
import { CambioEstado, Estados } from '@prisma/client';
import prisma from '../../lib/db';
import { CambioEstadoCreateData } from '../interfaces/cambioEstado-create.interface';
import { ICambioEstadoRepository } from './cambioEstado.repository.interface';

@Injectable()
export class CambioEstadoRepository implements ICambioEstadoRepository {
  async create(data: CambioEstadoCreateData): Promise<CambioEstado> {
    try {
      return await prisma.cambioEstado.create({ data });
    } catch (error) {
      throw new Error(`Error al crear el cambio de estado: ${String(error)}`);
    }
  }

  async close(reclamoId: string): Promise<void> {
    try {
      await prisma.cambioEstado.updateMany({
        where: {
          reclamoId: reclamoId,
          OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
        },
        data: { fechaFin: new Date() },
      });
    } catch (error) {
      throw new Error(`Error al cerrar el cambio de estado: ${String(error)}`);
    }
  }

  async findByReclamoId(reclamoId: string): Promise<CambioEstado[]> {
    try {
      return await prisma.cambioEstado.findMany({ where: { reclamoId } });
    } catch (error) {
      throw new Error(`
        Error al obtener los cambios de estado: ${String(error)}`);
    }
  }

  async findByEstado(estado: Estados): Promise<CambioEstado[]> {
    try {
      return await prisma.cambioEstado.findMany({ where: { estado } });
    } catch (error) {
      throw new Error(`
        Error al obtener los cambios de estado: ${String(error)}`);
    }
  }

  async findLastCambioEstado(id: string): Promise<CambioEstado | null> {
    const cambiosEstado = await prisma.cambioEstado.findMany({
      where: {
        reclamoId: id,
      },
      orderBy: {
        fechaInicio: 'desc',
      },
      take: 1,
    });
    return cambiosEstado[0];
  }
}
