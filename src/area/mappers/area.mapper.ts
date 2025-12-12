import { Area } from '@prisma/client';
import { AreaDto } from '../dtos/area.dto';

export class AreaMapper {
  static toAreaDto(area: Area): AreaDto {
    const dto: AreaDto = {
      id: area.id,
      nombre: area.nombre,
      descripcion: area.descripcion ?? undefined,
    };
    return dto;
  }
}
