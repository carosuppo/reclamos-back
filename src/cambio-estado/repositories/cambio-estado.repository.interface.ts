import { CambioEstado, Prisma } from '@prisma/client';
import { CambioEstadoConUsuario } from '../cambio-estado.type';
import { CambioEstadoCreateData } from '../interfaces/cambio-estado.interface';

export interface ICambioEstadoRepository {
  create(
    data: CambioEstadoCreateData,
    prismaClient?: Prisma.TransactionClient,
  ): Promise<CambioEstado>;
  close(
    reclamoId: string,
    prismaClient?: Prisma.TransactionClient,
  ): Promise<void>;
  findByReclamoId(reclamoId: string): Promise<CambioEstadoConUsuario[]>;
  findByEstado(estado: string): Promise<CambioEstado[]>;
  findLastCambioEstado(id: string): Promise<CambioEstado | null>;
}
