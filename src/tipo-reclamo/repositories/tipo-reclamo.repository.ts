import { ITipoReclamoRepository } from './tipo-reclamo.repository.interface';
import { Injectable } from '@nestjs/common';
import { TipoReclamo } from '@prisma/client';
import prisma from '../../lib/db';

@Injectable()
export class TipoReclamoRepository implements ITipoReclamoRepository {
  async findAll(): Promise<TipoReclamo[]> {
    return await prisma.tipoReclamo.findMany({
      where: {
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findById(id: string): Promise<TipoReclamo | null> {
    return await prisma.tipoReclamo.findFirst({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }
}
