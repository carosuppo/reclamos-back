import { Cliente } from '@prisma/client';
import { ClienteUpdateData } from '../interfaces/cliente-update.interface';
import { ClienteCreateData } from '../interfaces/cliente-create.interface';

export interface IClienteRepository {
  create(data: ClienteCreateData): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findByEmail(email: string): Promise<Cliente | null>;
  findById(id: string): Promise<Cliente | null>;
  update(id: string, data: ClienteUpdateData): Promise<Cliente>;
  softDelete(id: string): Promise<void>;
}
