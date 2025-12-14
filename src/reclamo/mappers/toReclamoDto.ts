import { Reclamo } from '@prisma/client';
import { ReclamoDto } from '../dtos/reclamo.dto';
import { Medidas } from '../../common/enums/medidas.enum';

export function toReclamoDto(reclamo: Reclamo): ReclamoDto {
  return {
    id: reclamo.id,
    tipoReclamo: reclamo.tipoReclamoId,
    proyecto: reclamo.proyectoId,
    prioridad: Medidas[reclamo.prioridad] as Medidas,
    criticidad: Medidas[reclamo.criticidad] as Medidas,
    descripcion: reclamo.descripcion,
    estado: reclamo.estado,
  };
}
