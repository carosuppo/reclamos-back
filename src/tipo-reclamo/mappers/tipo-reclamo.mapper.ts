import { TipoReclamo } from '@prisma/client';
import { TipoReclamoDTO } from '../dtos/tipo-reclamo.dto';

export function toTipoReclamoDTO(tipoReclamo: TipoReclamo): TipoReclamoDTO {
  return {
    id: tipoReclamo.id,
    nombre: tipoReclamo.nombre,
    descripcion: tipoReclamo.descripcion ?? undefined,
  };
}
