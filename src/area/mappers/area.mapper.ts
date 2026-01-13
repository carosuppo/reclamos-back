import { Area } from '@prisma/client';
import { AreaDTO } from '../dtos/area.dto';
import { CreateAreaDTO, UpdateAreaDTO } from '../dtos/create-area.dto';
import { areaCreateData, areaUpdateData } from '../interfaces/area.interface';

export const AreaMapper = {
  // Toma la información de la base de datos y la pasa a formato DTO
  toAreaDto(area: Area): AreaDTO {
    return {
      id: area.id,
      nombre: area.nombre,
      descripcion: area.descripcion ?? '',
    };
  },

  // Toma la información del DTO y la pasa a formato de la base de datos
  toAreaCreateData(dto: CreateAreaDTO): areaCreateData {
    return {
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    };
  },

  // Toma la información del DTO y la pasa a formato de la base de datos
  toAreaUpdateData(id: string, dto: UpdateAreaDTO): areaUpdateData {
    return {
      id: id,
      nombre: dto.nombre,
      descripcion: dto.descripcion,
    };
  },
};
