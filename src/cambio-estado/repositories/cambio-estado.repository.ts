import { Injectable } from '@nestjs/common';
import { CambioEstado, Estados, Prisma } from '@prisma/client';
import prisma from '../../lib/db';
import { CambioEstadoCreateData } from '../interfaces/cambio-estado.interface';
import { ICambioEstadoRepository } from './cambio-estado.repository.interface';

@Injectable()
export class CambioEstadoRepository implements ICambioEstadoRepository {
  async create(
    data: CambioEstadoCreateData,
    tx: Prisma.TransactionClient,
  ): Promise<CambioEstado> {
    return await tx.cambioEstado.create({ data });
  }

  async close(id: string, tx: Prisma.TransactionClient): Promise<void> {
    // Insertar fechaFin en el cambio de estado activo del reclamo
    await tx.cambioEstado.updateMany({
      where: {
        id,
        OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
      },
      data: { fechaFin: new Date() },
    });
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
