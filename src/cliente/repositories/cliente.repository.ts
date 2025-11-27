import { Injectable, NotFoundException } from '@nestjs/common';
import { IClienteRepository } from './cliente.repository.interface';
import prisma from '../../lib/db';
import { Cliente } from '@prisma/client';
import { UsuarioCreateData } from 'src/common/interfaces/usuario-create.interface';
import { ClienteUpdateData } from '../interfaces/cliente-update.interface';

@Injectable()
export class ClienteRepository implements IClienteRepository {
  constructor() {}

  async create(data: UsuarioCreateData): Promise<Cliente> {
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

  async findAll(): Promise<Cliente[]> {
    const clientes = await prisma.cliente.findMany();
    return clientes.filter((cliente) => !cliente.deletedAt);
  }

  async findByEmail(email: string): Promise<Cliente | null> {
    const cliente = await prisma.cliente.findFirst({
      where: { email },
    });

    if (!cliente || cliente.deletedAt) {
      return null;
    }

    return cliente;
  }

  async findById(id: string): Promise<Cliente | null> {
    const cliente = await prisma.cliente.findFirst({
      where: { id },
    });

    if (!cliente || cliente.deletedAt) {
      return null;
    }

    return cliente;
  }

  async update(id: string, data: ClienteUpdateData): Promise<Cliente> {
    return await prisma.cliente.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string): Promise<void> {
    const cliente = await prisma.cliente.findFirst({
      where: { id },
    });

    if (!cliente || cliente.deletedAt) {
      throw new NotFoundException(`El cliente con id "${id}" no existe`);
    }

    await prisma.empleado.update({
      where: { id: cliente.id },
      data: { deletedAt: new Date() },
    });
  }
}
