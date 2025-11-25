import { TipoProyecto } from '@prisma/client';

export interface ITipoProyectoRepository {
  findAll(): Promise<TipoProyecto[]>;
  findOne(id: string): Promise<TipoProyecto | null>;
}
