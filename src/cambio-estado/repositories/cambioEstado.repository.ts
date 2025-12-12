import { Injectable } from '@nestjs/common';
import { CambioEstado } from '@prisma/client';
import prisma from '../../lib/db';
import { CambioEstadoCreateData } from '../interfaces/cambioEstado-create.interface';
import { ICambioEstadoRepository } from './cambioEstado.repository.interface';

@Injectable()
export class CambioEstadoRepository implements ICambioEstadoRepository {
  async create(data: CambioEstadoCreateData): Promise<CambioEstado> {
    try {
      return await prisma.cambioEstado.create({ data });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error al crear el cambio de estado: ${error.message}`);
      }

      throw new Error(`Error al crear el cambio de estado: ${String(error)}`);
    }
  }
}
