import { Cliente } from '@prisma/client';
import { ClienteUpdateData } from '../interfaces/cliente.interface';
import { ClienteCreateData } from '../interfaces/cliente.interface';

export interface IClienteRepository {
  create(data: ClienteCreateData): Promise<Cliente>;
  update(data: ClienteUpdateData): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findByEmail(email: string): Promise<Cliente | null>;
  findById(id: string): Promise<Cliente | null>;
  delete(id: string): Promise<void>;
}
