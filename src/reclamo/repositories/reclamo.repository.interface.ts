import { Reclamo } from '@prisma/client';
import {
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo-create.interface';
import { CambioEstadoCreateData } from 'src/cambio-estado/interfaces/cambioEstado-create.interface';

export interface IReclamoRepository {
  create(
    data: ReclamoCreateData,
    userId: string,
  ): Promise<Reclamo & { cambioEstadoId: string }>;
  findByCliente(clienteId: string): Promise<Reclamo[]>;
  findOne(id: string): Promise<Reclamo | null>;
  update(data: ReclamoData): Promise<Reclamo>;
  updateEstado(data: CambioEstadoCreateData): Promise<Reclamo>;
  reassignArea(data: CambioEstadoCreateData): Promise<Reclamo>;
}
