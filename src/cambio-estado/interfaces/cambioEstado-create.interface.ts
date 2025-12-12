import { Estados } from '@prisma/client';

export interface CambioEstadoCreateData {
  reclamoId: string;
  areaId: string;
  empleadoId?: string;
  clienteId?: string;
  estado: Estados;
  descripcion: string;
}
