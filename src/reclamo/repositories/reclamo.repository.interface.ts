import { Estados, Reclamo } from '@prisma/client';
import { CambioEstadoCreateData } from '../../cambio-estado/interfaces/cambio-estado.interface';
import {
  FiltrosReclamoData,
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo.interface';
import { ReclamoCompleto } from '../reclamo.type';

export interface IReclamoRepository {
  create(data: ReclamoCreateData, userId: string): Promise<Reclamo>;
  update(data: ReclamoData): Promise<Reclamo>;
  changeEstado(data: CambioEstadoCreateData): Promise<Reclamo>;
  reassignArea(data: CambioEstadoCreateData): Promise<Reclamo>;
  findById(id: string): Promise<ReclamoCompleto | null>;
  findAll(): Promise<Reclamo[]>;
  findByCliente(clienteId: string): Promise<ReclamoCompleto[]>;
  findByArea(areaId: string): Promise<ReclamoCompleto[]>;
  findDates(
    areaId: string,
    estado?: Estados,
  ): Promise<{ createdAt: Date; updatedAt: Date }[]>;
  countByFiltros(filtros: FiltrosReclamoData): Promise<number>;
  countByArea(areaId: string, estado?: Estados): Promise<number>;
}
