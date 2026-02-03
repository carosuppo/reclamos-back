import prisma from '../../lib/db';
import { TipoProyecto } from '@prisma/client';
import { ITipoProyectoRepository } from './tipo-proyecto.repository.interface';

export class TipoProyectoRepository implements ITipoProyectoRepository {
  async findAll(): Promise<TipoProyecto[]> {
    return await prisma.tipoProyecto.findMany({
      where: {
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findById(id: string): Promise<TipoProyecto | null> {
    const tipoProyecto = await prisma.tipoProyecto.findFirst({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });

    return tipoProyecto;
  }
}
