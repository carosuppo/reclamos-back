import { Estados } from '@prisma/client';
import { Medidas } from 'src/common/enums/medidas.enum';

export interface ReclamoData {
  reclamoId?: string;
  tipoReclamoId: string;
  prioridad: Medidas;
  criticidad: Medidas;
  areaId: string;
  descripcion: string;
  estado: Estados;
  clienteId: string;
}

export interface ReclamoCreateData extends ReclamoData {
  tipoReclamoId: string;
  proyectoId: string;
}
