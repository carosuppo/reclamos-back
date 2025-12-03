import { TipoReclamo } from '@prisma/client';
import { TipoReclamoDto } from '../dto/tipo-reclamo.dto';

export class TipoReclamoMapper {
  static toTipoReclamoDto(tipoReclamo: TipoReclamo): TipoReclamoDto {
    const dto: TipoReclamoDto = {
      id: tipoReclamo.id,
      nombre: tipoReclamo.nombre,
      descripcion: tipoReclamo.descripcion ?? undefined,
    };
    return dto;
  }
}
