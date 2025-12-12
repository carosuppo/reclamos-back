import { CambioEstado } from '@prisma/client';
import { CambioEstadoCreateData } from '../interfaces/cambioEstado-create.interface';

export interface ICambioEstadoRepository {
  create(data: CambioEstadoCreateData): Promise<CambioEstado>;
}
