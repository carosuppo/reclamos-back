import { Proyecto } from '@prisma/client';
import prisma from '../../lib/db';
import {
  ProyectoCreateData,
  ProyectoUpdateData,
} from '../interfaces/proyecto.interface';
import { IProyectoRepository } from './proyecto.repository.interface';

export class ProyectoRepository implements IProyectoRepository {
  async create(data: ProyectoCreateData): Promise<Proyecto> {
    return await prisma.proyecto.create({ data });
  }

  async update(data: ProyectoUpdateData): Promise<Proyecto> {
    return await prisma.proyecto.update({
      where: {
        id: data.id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
      data: {
        nombre: data?.nombre,
        descripcion: data?.descripcion,
        tipoProyectoId: data?.tipoProyectoId,
      },
    });
  }

  async findAll(user: string): Promise<Proyecto[]> {
    const proyectos = await prisma.proyecto.findMany({
      where: {
        clienteId: user,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
    return proyectos;
  }

  async findById(id: string): Promise<Proyecto | null> {
    const proyecto = await prisma.proyecto.findFirst({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });

    return proyecto;
  }

  async findByTipoProyecto(
    tipoProyectoId: string,
    user: string,
  ): Promise<Proyecto[]> {
    const proyectos = await prisma.proyecto.findMany({
      where: {
        tipoProyectoId,
        clienteId: user,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
    return proyectos;
  }

  async delete(id: string): Promise<Proyecto> {
    return await prisma.proyecto.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
