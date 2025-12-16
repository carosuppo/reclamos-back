import { Estados } from '@prisma/client';
import { CreateReclamoDto } from '../dtos/create-reclamo.dto';
import {
  ReclamoCreateData,
  ReclamoData,
} from '../interfaces/reclamo-create.interface';
import { UpdateReclamoDto } from '../dtos/update-reclamo.dto';
import { ReclamoDto } from '../dtos/reclamo.dto';
import { CambioEstadoDto } from '../../cambio-estado/dtos/cambio-estado.dto';

export function toReclamoCreateData(
  dto: CreateReclamoDto,
  clienteId: string,
): ReclamoCreateData {
  return {
    tipoReclamoId: dto.tipoReclamoId,
    proyectoId: dto.proyectoId,
    prioridad: dto.prioridad,
    criticidad: dto.criticidad,
    areaId: dto.areaId,
    descripcion: dto.descripcion,
    estado: Estados.PENDIENTE,
    clienteId: clienteId,
  };
}

export function toReclamoUpdateData(
  id: string,
  dto: UpdateReclamoDto,
  clienteId: string,
  reclamo: ReclamoDto,
  cambioEstado: CambioEstadoDto,
): ReclamoData {
  return {
    reclamoId: id,
    tipoReclamoId: dto.tipoReclamoId ?? reclamo.tipoReclamo,
    prioridad: dto.prioridad ?? reclamo.prioridad,
    criticidad: dto.criticidad ?? reclamo.criticidad,
    areaId: dto.areaId ?? cambioEstado.areaId,
    descripcion: dto.descripcion,
    estado: Estados.PENDIENTE,
    clienteId: clienteId,
  };
}
