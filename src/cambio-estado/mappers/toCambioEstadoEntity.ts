import { CambioEstado, Estados } from '@prisma/client';
import { CreateCambioEstadoDto } from '../dto/create-cambio-estado.dto';
import { CambioEstadoCreateData } from '../interfaces/cambioEstado-create.interface';
import { UpdateEstadoDto } from 'src/reclamo/dtos/update-estado.dto';
import { ReasignarAreaDto } from 'src/reclamo/dtos/reasignar-area.dto';

export function toCambioEstadoCreateData(
  dto: CreateCambioEstadoDto,
): CambioEstadoCreateData {
  return {
    clienteId: dto.clienteId,
    reclamoId: dto.reclamoId,
    areaId: dto.areaId,
    empleadoId: dto.empleadoId,
    estado: dto.estado,
    descripcion: dto.descripcion,
  };
}

export function toCambioEstadoData(
  id: string,
  cambioEstado: CambioEstado,
  dto: UpdateEstadoDto,
  userId: string,
): CambioEstadoCreateData {
  return {
    reclamoId: cambioEstado.reclamoId,
    areaId: cambioEstado.areaId,
    empleadoId: userId,
    estado: dto.estado,
    descripcion: dto.descripcion ?? '',
  };
}

export function toCambioEstadoClienteData(
  cambioEstado: CambioEstado,
  dto: ReasignarAreaDto,
  userId: string,
): CambioEstadoCreateData {
  return {
    reclamoId: cambioEstado.reclamoId,
    areaId: dto.areaId,
    clienteId: userId,
    estado: Estados.PENDIENTE,
    descripcion: dto.descripcion,
  };
}
