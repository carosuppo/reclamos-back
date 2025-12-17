import { Estados } from '@prisma/client';
import {
  CambioEstadoAreaIdField,
  CambioEstadoClienteIdField,
  CambioEstadoDescripcionField,
  CambioEstadoEmpleadoIdField,
  CambioEstadoEstadoField,
  CambioEstadoFechaFinField,
  CambioEstadoFechaInicioField,
  CambioEstadoIdField,
  CambioEstadoReclamoIdField,
} from '../swaggers/cambio-estado.dto.swagger';

export class CambioEstadoDto {
  @CambioEstadoIdField()
  id: string;

  @CambioEstadoReclamoIdField()
  reclamoId: string;

  @CambioEstadoAreaIdField()
  areaId: string;

  @CambioEstadoFechaInicioField()
  fechaInicio: Date;

  @CambioEstadoFechaFinField()
  fechaFin: Date | null;

  @CambioEstadoDescripcionField(false)
  descripcion: string | null;

  @CambioEstadoEstadoField()
  estado: Estados;

  @CambioEstadoEmpleadoIdField()
  empleadoId: string | null;

  @CambioEstadoClienteIdField()
  clienteId: string | null;
}
