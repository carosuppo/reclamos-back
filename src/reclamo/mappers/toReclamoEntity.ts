import { Estados } from '@prisma/client';
import { CreateReclamoDto } from '../dtos/create-reclamo.dto';
import { ReclamoCreateData } from '../interfaces/reclamo-create.interface';

export function toReclamoCreateData(
  dto: CreateReclamoDto,
  id: string,
): ReclamoCreateData {
  return {
    tipoReclamoId: dto.tipoReclamoId,
    proyectoId: dto.proyectoId,
    prioridad: dto.prioridad,
    criticidad: dto.criticidad,
    areaId: dto.areaId,
    descripcion: dto.descripcion,
    estado: Estados.PENDIENTE,
    clienteId: id,
  };
}
