import prisma from 'src/lib/db';
import { TipoProyecto } from '@prisma/client';
import { ITipoProyectoRepository } from './tipo-proyecto.repository.interface';

export class TipoProyectoRepository implements ITipoProyectoRepository {
  async findAll(): Promise<TipoProyecto[]> {
    const tipoProyecto = await prisma.tipoProyecto.findMany({});
    return tipoProyecto.filter((tp) => !tp.deletedAt);
  }

  async findOne(id: string): Promise<TipoProyecto | null> {
    const tipoProyecto = await prisma.tipoProyecto.findFirst({
      where: { id },
    });

    if (!tipoProyecto || tipoProyecto.deletedAt) {
      return null;
    }

    return tipoProyecto;
  }
}
