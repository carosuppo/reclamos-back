import { Estados } from '@prisma/client';
import { Medidas } from 'src/common/enums/medidas.enum';

export class ReclamoDto {
  id: string;
  tipoReclamo: string;
  proyecto: string;
  prioridad: Medidas;
  criticidad: Medidas;
  descripcion: string;
  estado: Estados;
  areaId?: string;
}
