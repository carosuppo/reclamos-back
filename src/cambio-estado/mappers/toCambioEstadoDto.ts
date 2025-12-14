import { CambioEstado } from '@prisma/client';
import { CambioEstadoDto } from '../dto/cambioEstado.dto';

export function toCambioEstadoDto(cambio: CambioEstado): CambioEstadoDto {
  return {
    id: cambio.id,
    reclamoId: cambio.reclamoId,
    areaId: cambio.areaId,
    fechaInicio: cambio.fechaInicio,
    fechaFin: cambio.fechaFin ?? null,
    descripcion: cambio.descripcion ?? null,
    estado: cambio.estado,
    empleadoId: cambio.empleadoId ?? null,
    clienteId: cambio.clienteId ?? null,
  };
}
