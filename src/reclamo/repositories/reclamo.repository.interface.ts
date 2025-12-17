import { Reclamo } from '@prisma/client';
import {
  FiltrosReclamoData,
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo-create.interface';
import { CambioEstadoCreateData } from '../../cambio-estado/interfaces/cambio-estado-create.interface';

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
  findAll(): Promise<Reclamo[]>;
  findByFiltros(filtros: FiltrosReclamoData): Promise<number>;
  findDatesResueltos(
    areaId: string,
  ): Promise<{ createdAt: Date; updatedAt: Date }[]>;
  countTotalByArea(areaId: string): Promise<number>;
  countResueltosByArea(areaId: string): Promise<number>;
}
