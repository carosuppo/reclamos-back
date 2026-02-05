import { TipoReclamo } from '@prisma/client';

export interface ITipoReclamoRepository {
  findAll(): Promise<TipoReclamo[]>;
  findById(id: string): Promise<TipoReclamo | null>;
}
