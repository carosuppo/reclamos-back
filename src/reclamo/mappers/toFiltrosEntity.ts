import { FindReclamoDto } from '../dtos/find-reclamo.dto';
import { FiltrosReclamoData } from '../interfaces/reclamo-create.interface';

export function toFiltrosReclamoData(dto: FindReclamoDto): FiltrosReclamoData {
  return {
    estado: dto.estado ?? undefined,
    clienteId: dto.clienteId ?? undefined,
    fechaDesde: dto.fechaDesde ? new Date(dto.fechaDesde) : undefined,
    fechaHasta: dto.fechaHasta ? new Date(dto.fechaHasta) : undefined,
  };
}
