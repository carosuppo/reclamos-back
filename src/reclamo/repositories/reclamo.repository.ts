import { Inject, Injectable } from '@nestjs/common';
import prisma from '../../lib/db';
import {
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo-create.interface';
import { Estados, Reclamo } from '@prisma/client';
import type { ICambioEstadoRepository } from 'src/cambio-estado/repositories/cambioEstado.repository.interface';
import type { IReclamoRepository } from './reclamo.repository.interface';
import { CambioEstadoCreateData } from 'src/cambio-estado/interfaces/cambioEstado-create.interface';

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
}
