import { TipoReclamo } from '@prisma/client';
import { TipoReclamoDto } from '../dtos/tipo-reclamo.dto';

export class TipoReclamoMapper {
  public toTipoReclamoDto(tipoReclamo: TipoReclamo): TipoReclamoDto {
    const dto: TipoReclamoDto = {
      id: tipoReclamo.id,
      nombre: tipoReclamo.nombre,
      descripcion: tipoReclamo.descripcion ?? undefined,
    };
    return dto;
  }
}
