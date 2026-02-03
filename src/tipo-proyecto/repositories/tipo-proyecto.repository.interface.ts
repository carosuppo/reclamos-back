import { TipoProyecto } from '@prisma/client';

export interface ITipoProyectoRepository {
  findAll(): Promise<TipoProyecto[]>;
  findById(id: string): Promise<TipoProyecto | null>;
}
