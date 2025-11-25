import prisma from 'src/lib/db';
import { Proyecto } from '@prisma/client';
import { IProyectoRepository } from './proyecto.repository.interface';
import { ProyectoInterfaz } from '../interfaces/proyecto.interfaz';

export class ProyectoRepository implements IProyectoRepository {
  async findAll(): Promise<Proyecto[]> {
    const proyecto = await prisma.proyecto.findMany({});
    return proyecto.filter((proyecto) => !proyecto.deletedAt);
  }

  async findOne(id: string): Promise<Proyecto | null> {
    const proyecto = await prisma.proyecto.findFirst({
      where: { id },
    });

    if (!proyecto || proyecto.deletedAt) {
      return null;
    }

    return proyecto;
  }

  async findByTipoProyecto(tipoProyectoId: string): Promise<Proyecto[]> {
    const proyectos = await prisma.proyecto.findMany({
      where: {
        tipoProyectoId,
      },
    });
    return proyectos.filter((proyecto) => !proyecto.deletedAt);
  }

  async create(proyectoInterfaz: ProyectoInterfaz): Promise<Proyecto> {
    return await prisma.proyecto.create({ data: proyectoInterfaz });
  }

  async update(
    id: string,
    proyectoInterfaz: ProyectoInterfaz,
  ): Promise<Proyecto> {
    return await prisma.proyecto.update({
      where: {
        id,
      },
      data: proyectoInterfaz,
    });
  }

  async remove(id: string): Promise<boolean> {
    await prisma.proyecto.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return true;
  }
}
