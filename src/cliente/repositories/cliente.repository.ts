import { Injectable } from '@nestjs/common';
import { Cliente } from '@prisma/client';
import prisma from '../../lib/db';
import {
  ClienteCreateData,
  ClienteUpdateData,
} from '../interfaces/cliente.interface';
import { IClienteRepository } from './cliente.repository.interface';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor() {}

  async create(data: ClienteCreateData): Promise<Cliente> {
    try {
      return await prisma.cliente.create({ data });
    } catch (error) {
      const prismaError = error as { code?: string };

      if (prismaError.code === 'P2002') {
        throw new Error(`Cliente duplicado: ${data.email}`);
      }

      if (error instanceof Error) {
        throw new Error(`Error al crear el cliente: ${error.message}`);
      }

      throw new Error(`Error al crear el cliente: ${String(error)}`);
    }
  }

  async update(data: ClienteUpdateData): Promise<Cliente> {
    return await prisma.cliente.update({
      where: { id: data.id },
      data: {
        nombre: data?.nombre,
        telefono: data?.telefono,
        email: data?.email,
      },
    });
  }

  async findAll(): Promise<Cliente[]> {
    return await prisma.cliente.findMany({
      where: {
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    return await prisma.cliente.findFirst({
      where: {
        email,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async findById(id: string): Promise<Cliente | null> {
    return await prisma.cliente.findFirst({
      where: {
        id,
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.empleado.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
