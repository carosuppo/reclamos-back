import { Reclamo } from '@prisma/client';
import { ReclamoDto } from '../dtos/reclamo.dto';
import { toMedidasEnum } from './toMedidaEnum';

export function toReclamoDto(reclamo: Reclamo): ReclamoDto {
  return {
    id: reclamo.id,
    tipoReclamo: reclamo.tipoReclamoId,
    proyecto: reclamo.proyectoId,
    prioridad: toMedidasEnum(reclamo.prioridad),
    criticidad: toMedidasEnum(reclamo.criticidad),
    descripcion: reclamo.descripcion,
    estado: reclamo.estado,
  };
}
