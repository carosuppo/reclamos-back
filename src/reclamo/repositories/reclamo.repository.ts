import { Inject, Injectable } from '@nestjs/common';
import { Estados, Prisma, Reclamo } from '@prisma/client';
import { CambioEstadoCreateData } from '../../cambio-estado/interfaces/cambio-estado.interface';
import type { ICambioEstadoRepository } from '../../cambio-estado/repositories/cambio-estado.repository.interface';
import prisma from '../../lib/db';
import {
  FiltrosReclamoData,
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo.interface';
import type { IReclamoRepository } from './reclamo.repository.interface';

@Injectable()
export class ReclamoRepository implements IReclamoRepository {
  constructor(
    @Inject('ICambioEstadoRepository')
    private readonly cambioEstadoRepository: ICambioEstadoRepository,
  ) {}
  async create(data: ReclamoCreateData, userId: string): Promise<Reclamo> {
    try {
      // Usamos transaction para ejecutar múltiples operaciones de forma atómica
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Crear el reclamo
        const reclamo = await tx.reclamo.create({
          data: {
            tipoReclamoId: data.tipoReclamoId,
            proyectoId: data.proyectoId,
            prioridad: data.prioridad,
            criticidad: data.criticidad,
            descripcion: data.descripcion,
            estado: Estados.PENDIENTE,
          },
        });
        // 2. Crear el primer cambio de estado asociado al reclamo
        const cambioEstado = await this.cambioEstadoRepository.create(
          {
            reclamoId: reclamo.id,
            areaId: data.areaId,
            estado: Estados.PENDIENTE,
            clienteId: userId,
            descripcion: data.descripcion,
          },
          tx, // Pasamos la transaccion
        );

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

  async update(data: ReclamoData): Promise<Reclamo> {
    // Actualiza los datos del reclamo, creando un nuevo cambio de estado
    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Actualizar el reclamo
        const reclamo = await tx.reclamo.update({
          where: {
            id: data.reclamoId,
          },
          data: {
            tipoReclamoId: data.tipoReclamoId,
            prioridad: data.prioridad,
            criticidad: data.criticidad,
            descripcion: data.descripcion,
            estado: data.estado,
          },
        });

        // 2. Cerrar el cambio de estado anterior
        await this.cambioEstadoRepository.close(reclamo.id, tx); // Se mantiene en la misma transacción

        // 3. Crear el cambio de estado asociado al reclamo
        const cambioEstado = await this.cambioEstadoRepository.create(
          {
            reclamoId: reclamo.id,
            areaId: data.areaId,
            estado: data.estado,
            clienteId: data.clienteId,
            descripcion: data.descripcion,
          },
          tx, // Se mantiene en la misma transacción, para evitar inconsistencias
        );

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

  async changeEstado(data: CambioEstadoCreateData): Promise<Reclamo> {
    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Actualizar el estado del reclamo
        const reclamo = await tx.reclamo.update({
          where: {
            id: data.reclamoId,
          },
          data: {
            estado: data.estado,
          },
        });

        // 2. Cerrar el cambio de estado anterior
        await this.cambioEstadoRepository.close(reclamo.id, tx); // Se mantiene en la misma transacción

        // 3. Crear el cambio de estado asociado al reclamo
        const cambioEstado = await this.cambioEstadoRepository.create(
          {
            reclamoId: reclamo.id,
            areaId: data.areaId,
            estado: data.estado,
            empleadoId: data.empleadoId,
            descripcion: data.descripcion,
          },
          tx, // Se mantiene en la misma transacción, para evitar inconsistencias
        );

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
    // Reasigna el área del reclamo, actualizando su estado
    try {
      const resultado = await prisma.$transaction(async (tx) => {
        // 1. Actualizar el estado del reclamo
        const reclamo = await tx.reclamo.update({
          where: {
            id: data.reclamoId,
          },
          data: {
            estado: data.estado,
          },
        });

        // 2. Cerrar el cambio de estado anterior
        await this.cambioEstadoRepository.close(reclamo.id, tx); // Se mantiene en la misma transacción

        // 3. Crear el cambio de estado asociado al reclamo
        const cambioEstado = await this.cambioEstadoRepository.create(
          {
            reclamoId: reclamo.id,
            areaId: data.areaId,
            estado: data.estado,
            empleadoId: data.empleadoId,
            descripcion: data.descripcion,
          },
          tx, // Se mantiene en la misma transacción, para evitar inconsistencias
        );

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

  findByCliente(clienteId: string): Promise<Reclamo[]> {
    // Selecciona los reclamos asociados al cliente
    return prisma.reclamo.findMany({
      where: {
        proyecto: {
          clienteId,
        },
        // No selecciona los reclamos eliminados
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
      include: {
        tipoReclamo: true,
        proyecto: true,
      },
    });
  }

  async findById(id: string): Promise<Reclamo | null> {
    // Selecciona el reclamo con el id proporcionado, incluyendo el historial de estados
    return await prisma.reclamo.findFirst({
      where: {
        id,
        // No es necesario filtrar por eliminados en este método
      },
      // Incluye todos el historial de estados de ese reclamo
      include: {
        cambioEstado: true,
      },
    });
  }

  async findAll(): Promise<Reclamo[]> {
    return prisma.reclamo.findMany({
      where: {
        // No selecciona los reclamos eliminados
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findDates(
    areaId: string,
    estado?: Estados,
  ): Promise<{ createdAt: Date; updatedAt: Date }[]> {
    // Obtiene las fechas de creación y actualización de los reclamos de un área
    return prisma.reclamo.findMany({
      where: {
        // En caso de que se filtre por estado, solo recibe los reclamos con ese estado
        estado,
        cambioEstado: {
          // Selecciona los reclamos que tengan el estado actual en el área seleccionada
          some: {
            areaId: areaId,
            OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
          },
        },
        // No selecciona los reclamos eliminados
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
      // Del reclamo seleccionado sólo retorna las fechas de creación y actualización
      select: {
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async countByFiltros(filtros: FiltrosReclamoData): Promise<number> {
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

  async countByArea(areaId: string, estado?: Estados): Promise<number> {
    // Obtiene el número de reclamos de un área
    return prisma.reclamo.count({
      where: {
        // En caso de que se filtre por estado, solo seleccionará los reclamos con ese estado
        estado,
        cambioEstado: {
          // Selecciona los reclamos con el estado actual en el área seleccionada
          some: {
            areaId,
            OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
          },
        },
        // No selecciona los reclamos eliminados
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }
}
