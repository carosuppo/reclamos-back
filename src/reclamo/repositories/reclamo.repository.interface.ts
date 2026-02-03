import { Estados, Reclamo } from '@prisma/client';
import { CambioEstadoCreateData } from '../../cambio-estado/interfaces/cambio-estado.interface';
import {
  FiltrosReclamoData,
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo.interface';

export interface IReclamoRepository {
  create(data: ReclamoCreateData, userId: string): Promise<Reclamo>;
  update(data: ReclamoData): Promise<Reclamo>;
  changeEstado(data: CambioEstadoCreateData): Promise<Reclamo>;
  reassignArea(data: CambioEstadoCreateData): Promise<Reclamo>;
  findById(id: string): Promise<Reclamo | null>;
  findAll(): Promise<Reclamo[]>;
  findByCliente(clienteId: string): Promise<Reclamo[]>;
  findDates(
    areaId: string,
    estado?: Estados,
  ): Promise<{ createdAt: Date; updatedAt: Date }[]>;
  countByArea(areaId: string, estado?: Estados): Promise<number>;
  countByFiltros(filtros: FiltrosReclamoData): Promise<number>;
}
