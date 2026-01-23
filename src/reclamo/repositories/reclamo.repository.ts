import { Inject, Injectable } from '@nestjs/common';
import prisma from '../../lib/db';
import {
  FiltrosReclamoData,
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo-create.interface';
import { Estados, Prisma, Reclamo } from '@prisma/client';
import type { ICambioEstadoRepository } from '../../cambio-estado/repositories/cambio-estado.repository.interface';
import type { IReclamoRepository } from './reclamo.repository.interface';
import { CambioEstadoCreateData } from '../../cambio-estado/interfaces/cambio-estado-create.interface';

@Injectable()
export class ReclamoRepository implements IReclamoRepository {
  constructor(
    @Inject('ICambioEstadoRepository')
    private readonly cambioEstadoRepository: ICambioEstadoRepository,
  ) {}
  async create(
    reclamoData: ReclamoCreateData,
    userId: string,
  ): Promise<Reclamo & { cambioEstadoId: string }> {
    try {
      // Usamos $transaction para ejecutar múltiples operaciones de forma atómica
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Crear el reclamo
        const reclamo = await tx.reclamo.create({
          data: {
            tipoReclamoId: reclamoData.tipoReclamoId,
            proyectoId: reclamoData.proyectoId,
            prioridad: reclamoData.prioridad,
            criticidad: reclamoData.criticidad,
            descripcion: reclamoData.descripcion,
            estado: Estados.PENDIENTE,
          },
        });
        // 2. Crear el primer cambio de estado asociado al reclamo
        const cambioEstado = await this.cambioEstadoRepository.create({
          reclamoId: reclamo.id,
          areaId: reclamoData.areaId,
          estado: Estados.PENDIENTE,
          clienteId: userId,
          descripcion: reclamoData.descripcion,
        });

        return {
          ...reclamo,
          cambioEstadoId: cambioEstado.id,
        };
      });

      return resultado;
    } catch (error) {
      throw new Error(
        `Error al crear el reclamo con cambio de estado: ${String(error)}`,
      );
    }
  }

  findByCliente(clienteId: string) {
    return prisma.reclamo.findMany({
      where: {
        proyecto: {
          clienteId,
        },
      },
      include: {
        tipoReclamo: true,
        proyecto: true,
        cambioEstado: true,
      },
    });
  }

  async findOne(id: string): Promise<Reclamo | null> {
    return await prisma.reclamo.findUnique({
      where: {
        id,
      },
    });
  }

  async update(data: ReclamoData): Promise<Reclamo> {
    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Crear el reclamo
        const reclamo = await tx.reclamo.update({
          where: {
            id: data.reclamoId,
          },
          data: {
            tipoReclamoId: data.tipoReclamoId,
            prioridad: data.prioridad,
            criticidad: data.criticidad,
            descripcion: data.descripcion,
          },
        });

        await this.cambioEstadoRepository.close(reclamo.id);

        // 2. Crear el primer cambio de estado asociado al reclamo
        const cambioEstado = await this.cambioEstadoRepository.create({
          reclamoId: reclamo.id,
          areaId: data.areaId,
          estado: data.estado,
          clienteId: data.clienteId,
          descripcion: data.descripcion,
        });

        return {
          ...reclamo,
          cambioEstadoId: cambioEstado.id,
        };
      });

      return resultado;
    } catch (error) {
      throw new Error(
        `Error al crear el reclamo con cambio de estado: ${String(error)}`,
      );
    }
  }

  async updateEstado(data: CambioEstadoCreateData): Promise<Reclamo> {
    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Crear el reclamo
        const reclamo = await tx.reclamo.update({
          where: {
            id: data.reclamoId,
          },
          data: {
            estado: data.estado,
          },
        });

        await this.cambioEstadoRepository.close(reclamo.id);

        // 2. Crear el primer cambio de estado asociado al reclamo
        const cambioEstado = await this.cambioEstadoRepository.create({
          reclamoId: reclamo.id,
          areaId: data.areaId,
          estado: data.estado,
          empleadoId: data.empleadoId,
          descripcion: data.descripcion,
        });

        return {
          ...reclamo,
          cambioEstadoId: cambioEstado.id,
        };
      });

      return resultado;
    } catch (error) {
      throw new Error(
        `Error al crear el reclamo con cambio de estado: ${String(error)}`,
      );
    }
  }

  async reassignArea(data: CambioEstadoCreateData): Promise<Reclamo> {
    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Crear el reclamo
        const reclamo = await tx.reclamo.update({
          where: {
            id: data.reclamoId,
          },
          data: {
            estado: data.estado,
          },
        });

        await this.cambioEstadoRepository.close(reclamo.id);

        // 2. Crear el primer cambio de estado asociado al reclamo
        const cambioEstado = await this.cambioEstadoRepository.create({
          reclamoId: reclamo.id,
          areaId: data.areaId,
          estado: data.estado,
          empleadoId: data.empleadoId,
          descripcion: data.descripcion,
        });

        return {
          ...reclamo,
          cambioEstadoId: cambioEstado.id,
        };
      });

      return resultado;
    } catch (error) {
      throw new Error(
        `Error al crear el reclamo con cambio de estado: ${String(error)}`,
      );
    }
  }

  async findAll(): Promise<Reclamo[]> {
    return prisma.reclamo.findMany({
      include: {
        proyecto: {
          include: {
            cliente: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<Reclamo | null> {
    return prisma.reclamo.findUnique({
      where: {
        id,
      },
    });
  }

  async findByFiltros(filtros: FiltrosReclamoData): Promise<number> {
    const where: Prisma.ReclamoWhereInput = {};

    if (filtros.estado) {
      where.estado = filtros.estado;
    }

    if (filtros.clienteId) {
      where.proyecto = {
        clienteId: filtros.clienteId,
      };
    }

    if (filtros.fechaDesde || filtros.fechaHasta) {
      where.createdAt = {};

      if (filtros.fechaDesde) {
        where.createdAt.gte = filtros.fechaDesde;
      }

      if (filtros.fechaHasta) {
        const hasta = new Date(filtros.fechaHasta);
        hasta.setDate(hasta.getDate() + 1);
        where.createdAt.lt = hasta;
      }
    }

    if (filtros.areaId) {
      where.cambioEstado = {
        some: {
          areaId: filtros.areaId,
          OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
        },
      };
    }

    return await prisma.reclamo.count({
      where: {
        ...where,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findDatesResueltos(
    areaId: string,
  ): Promise<{ createdAt: Date; updatedAt: Date }[]> {
    return prisma.reclamo.findMany({
      where: {
        estado: 'RESUELTO',
        cambioEstado: {
          some: {
            areaId: areaId,
            OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
          },
          none: {
            OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
            areaId: { not: areaId },
          },
        },
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async countTotalByArea(areaId: string): Promise<number> {
    return prisma.reclamo.count({
      where: {
        cambioEstado: {
          some: {
            areaId,
            OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
          },
          none: {
            OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
            areaId: { not: areaId },
          },
        },
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async countResueltosByArea(areaId: string): Promise<number> {
    return prisma.reclamo.count({
      where: {
        estado: 'RESUELTO',
        cambioEstado: {
          some: {
            areaId,
            OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
          },
          none: {
            OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
            areaId: { not: areaId },
          },
        },
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }
}
