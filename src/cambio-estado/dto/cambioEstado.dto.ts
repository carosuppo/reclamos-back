import { Estados } from '@prisma/client';

export class CambioEstadoDto {
  id: string;
  reclamoId: string;
  areaId: string;
  fechaInicio: Date;
  fechaFin: Date | null;
  descripcion: string | null;
  estado: Estados;
  empleadoId: string | null;
}
