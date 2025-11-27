import { Cliente } from '@prisma/client';
import { UsuarioCreateData } from 'src/common/interfaces/usuario-create.interface';
import { ClienteUpdateData } from '../interfaces/cliente-update.interface';

export interface IClienteRepository {
  create(data: UsuarioCreateData): Promise<Cliente>;
  findAll(): Promise<Cliente[]>;
  findByEmail(email: string): Promise<Cliente | null>;
  findById(id: string): Promise<Cliente | null>;
  update(id: string, data: ClienteUpdateData): Promise<Cliente>;
  softDelete(id: string): Promise<void>;
}
