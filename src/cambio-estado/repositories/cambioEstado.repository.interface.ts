import { CambioEstado } from '@prisma/client';
import { CambioEstadoCreateData } from '../interfaces/cambioEstado-create.interface';

export interface ICambioEstadoRepository {
  create(data: CambioEstadoCreateData): Promise<CambioEstado>;
  close(reclamoId: string): Promise<void>;
  findByReclamoId(reclamoId: string): Promise<CambioEstado[]>;
  findByEstado(estado: string): Promise<CambioEstado[]>;
  findLastCambioEstado(id: string): Promise<CambioEstado | null>;
}
