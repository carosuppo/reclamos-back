import { ITipoReclamoRepository } from './tipo-reclamo.repository.interface';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TipoReclamo } from '@prisma/client';
import prisma from '../../lib/db';

@Injectable()
export class TipoReclamoRepository implements ITipoReclamoRepository {
  async findAll(): Promise<TipoReclamo[]> {
    const tipoReclamos = await prisma.tipoReclamo.findMany();
    return tipoReclamos.filter((tipoReclamo) => !tipoReclamo.deletedAt);
  }

  async findById(id: string): Promise<TipoReclamo> {
    const tipoReclamo = await prisma.tipoReclamo.findFirst({
      where: { id },
    });

    if (!tipoReclamo || tipoReclamo.deletedAt) {
      throw new NotFoundException(`Tipo de Reclamo con id ${id} no encontrado`);
    }
    return tipoReclamo;
  }
}
