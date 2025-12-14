import { TipoProyecto } from '@prisma/client';
import { TipoProyectoRespuestaDto } from '../dtos/respuesta-tipo-proyecto.dto';
import { CreateTipoProyectoDto } from '../dtos/create-tipo-proyecto.dto';
import { TipoProyectoInterfaz } from '../interfaces/tipo-proyecto.interfaz';

export function aTipoProyectoDto(
  proyecto: TipoProyecto,
): TipoProyectoRespuestaDto {
  const { id, nombre, descripcion } = proyecto;

  return {
    id: id,
    nombre: nombre,
    descripcion: descripcion,
  };
}

export function aTipoProyectoInterfaz(
  data: Partial<CreateTipoProyectoDto>,
): Partial<TipoProyectoInterfaz> {
  return {
    nombre: data.nombre,
    descripcion: data.descripcion,
  };
}
