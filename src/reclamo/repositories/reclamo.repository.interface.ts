import { Reclamo } from '@prisma/client';
import { ReclamoCreateData } from '../interfaces/reclamo-create.interface';

export interface IReclamoRepository {
  create(
    data: ReclamoCreateData,
    userId: string,
  ): Promise<Reclamo & { cambioEstadoId: string }>;
  findByCliente(clienteId: string): Promise<Reclamo[]>;
  findByIdCompleto(id: string): Promise<Reclamo | null>;
}
