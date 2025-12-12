import { Injectable } from '@nestjs/common';
import { IAreaRepository } from './area.repository.interface';
import prisma from '../../lib/db';
import { CreateAreaDto } from '../dtos/create-area.dto';
import { UpdateAreaDto } from '../dtos/update-area.dto';
import { Area } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class AreaRepository implements IAreaRepository {
  constructor() {}

  async create(data: CreateAreaDto): Promise<Area> {
    return prisma.area.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
      },
    });
  }

  async update(id: string, data: UpdateAreaDto): Promise<Area> {
    const area = await prisma.area.findFirst({
      where: { id },
    });

    if (!area || area.deletedAt) {
      throw new Error(`El área con id ${id} no existe`);
    }

    return prisma.area.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }

  async findAll(): Promise<Area[]> {
    const areas = await prisma.area.findMany();
    return areas.filter((area) => !area.deletedAt);
  }

  async findById(id: string): Promise<Area> {
    const area = await prisma.area.findFirst({
      where: { id },
    });

    if (!area || area.deletedAt) {
      throw new NotFoundException(`Área con id ${id} no encontrada`);
    }
    return area;
  }

  async softDelete(id: string): Promise<boolean> {
    const area = await prisma.area.findFirst({
      where: { id },
    });

    if (!area || area.deletedAt) {
      throw new Error(`El área con id ${id} no existe`);
    }

    await prisma.area.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    //podriamos poner algo de transacción porque sino si falla la actualización el área quedaría en un estado inconsistente
    return true;
  }

  async findByName(nombre: string): Promise<Area> {
    const area = await prisma.area.findFirst({
      where: { nombre: nombre },
    });

    if (!area || area.deletedAt) {
      throw new NotFoundException(`Área ${nombre} no encontrada`);
    }
    return area;
  }
}
