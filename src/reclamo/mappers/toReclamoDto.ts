import { Cliente, Proyecto, Reclamo } from '@prisma/client';
import { ReclamoDto } from '../dtos/reclamo.dto';
import { toMedidasEnum } from './toMedidaEnum';

export type ReclamoWithRelations = Reclamo & {
  proyecto: Proyecto & {
    cliente: Cliente;
  };
};

export function toReclamoDto(reclamo: Reclamo): ReclamoDto {
  return {
    id: reclamo.id,
    tipoReclamo: reclamo.tipoReclamoId,
    proyecto: reclamo.proyectoId,
    prioridad: toMedidasEnum(reclamo.prioridad),
    criticidad: toMedidasEnum(reclamo.criticidad),
    descripcion: reclamo.descripcion,
    estado: reclamo.estado,
    createdAt: reclamo.createdAt,
    updatedAt: reclamo.updatedAt,
  };
}

export function toReclamoDtoExtended(
  reclamo: ReclamoWithRelations,
): ReclamoDto {
  return {
    id: reclamo.id,
    tipoReclamo: reclamo.tipoReclamoId,
    proyectoNombre: reclamo.proyecto?.nombre,
    clienteNombre: reclamo.proyecto?.cliente?.nombre,
    proyecto: reclamo.proyectoId,
    prioridad: toMedidasEnum(reclamo.prioridad),
    criticidad: toMedidasEnum(reclamo.criticidad),
    descripcion: reclamo.descripcion,
    estado: reclamo.estado,
    createdAt: reclamo.createdAt,
    updatedAt: reclamo.updatedAt,
  };
}
