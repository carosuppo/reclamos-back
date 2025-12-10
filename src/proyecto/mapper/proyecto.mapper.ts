import { Proyecto } from '@prisma/client';
import { ProyectoRespuestaDto } from '../dto/respuesta-proyecto.dto';
import { ProyectoInterfaz } from '../interfaces/proyecto.interfaz';
import { CreateProyectoDto } from '../dto/create-proyecto.dto';

export function aProyectoDto(proyecto: Proyecto): ProyectoRespuestaDto {
  const { id, nombre, descripcion, tipoProyectoId } = proyecto;

  return {
    id: id,
    nombre: nombre,
    descripcion: descripcion,
    tipoProyectoId: tipoProyectoId,
  };
}

export function aProyectoInterfaz(
  data: Partial<CreateProyectoDto>,
  user: string,
): Partial<ProyectoInterfaz> {
  return {
    nombre: data.nombre,
    clienteId: user,
    descripcion: data.descripcion,
    tipoProyectoId: data.tipoProyectoId,
  };
}
