import { Estados } from '@prisma/client';

export class CreateCambioEstadoDto {
  clienteId?: string;
  empleadoId?: string;
  reclamoId: string;
  areaId: string;
  estado: Estados;
  descripcion: string;
}
