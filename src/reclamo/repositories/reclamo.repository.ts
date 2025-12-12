import { Inject, Injectable } from '@nestjs/common';
import prisma from '../../lib/db';
import { ReclamoCreateData } from '../interfaces/reclamo-create.interface';
import {
  CambioEstado,
  Estados,
  Proyecto,
  Reclamo,
  TipoReclamo,
} from '@prisma/client';
import type { ICambioEstadoRepository } from 'src/cambio-estado/repositories/cambioEstado.repository.interface';
import type { IReclamoRepository } from './reclamo.repository.interface';

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
      if (error instanceof Error) {
        throw new Error(
          `Error al crear el reclamo con cambio de estado: ${error.message}`,
        );
      }

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
        tipoReclamo: true, // nombre EXACTO del modelo en Prisma
        proyecto: true,
        cambioEstado: true,
      },
    });
  }

  async findByIdCompleto(id: string): Promise<
    | (Reclamo & {
        cambioEstado: CambioEstado[];
        tipoReclamo: TipoReclamo;
        proyecto: Proyecto;
      })
    | null
  > {
    return prisma.reclamo.findUnique({
      where: { id },
      include: {
        tipoReclamo: true,
        proyecto: true,
        cambioEstado: true,
      },
    });
  }
}
