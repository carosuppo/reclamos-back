import { CreateCambioEstadoDto } from '../dto/create-cambio-estado.dto';
import { CambioEstadoCreateData } from '../interfaces/cambioEstado-create.interface';

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
