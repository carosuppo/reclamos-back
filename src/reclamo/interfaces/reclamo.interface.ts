import { Estados } from '@prisma/client';
import { Medidas } from '../../common/enums/medidas.enum';

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

export interface FiltrosReclamoData {
  estado?: Estados;
  clienteId?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  areaId?: string;
}
