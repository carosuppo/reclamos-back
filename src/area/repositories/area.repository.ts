import { Injectable } from '@nestjs/common';
import { Area } from '@prisma/client';
import prisma from '../../lib/db';
import { areaCreateData, areaUpdateData } from '../interfaces/area.interface';
import { IAreaRepository } from './area.repository.interface';

@Injectable()
export class AreaRepository implements IAreaRepository {
  constructor() {}

  async create(data: areaCreateData): Promise<Area> {
    return await prisma.area.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
      },
    });
  }

  async update(data: areaUpdateData): Promise<Area> {
    return await prisma.area.update({
      where: {
        id: data.id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
      },
    });
  }

  async findAll(): Promise<Area[]> {
    return await prisma.area.findMany({
      where: {
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findById(id: string): Promise<Area | null> {
    return await prisma.area.findFirst({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findByName(nombre: string): Promise<Area | null> {
    return await prisma.area.findFirst({
      where: { nombre },
    });
  }

  async delete(id: string): Promise<Area> {
    return await prisma.area.update({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
      data: { deletedAt: new Date() },
    });
  }
}
