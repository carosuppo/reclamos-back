import { TipoProyecto } from '@prisma/client';
import { TipoProyectoDTO } from '../dtos/tipo-proyecto.dto';

export function aTipoProyectoDTO(proyecto: TipoProyecto): TipoProyectoDTO {
  const { id, nombre, descripcion } = proyecto;

  return {
    id: id,
    nombre: nombre,
    descripcion: descripcion,
  };
}
