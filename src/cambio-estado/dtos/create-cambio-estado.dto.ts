import { Estados } from '@prisma/client';
import {
  CambioEstadoAreaIdField,
  CambioEstadoClienteIdField,
  CambioEstadoDescripcionField,
  CambioEstadoEmpleadoIdField,
  CambioEstadoEstadoField,
  CambioEstadoReclamoIdField,
} from '../swaggers/cambio-estado.dto.swagger';

export class CreateCambioEstadoDto {
  @CambioEstadoClienteIdField()
  clienteId?: string;

  @CambioEstadoEmpleadoIdField()
  empleadoId?: string;

  @CambioEstadoReclamoIdField()
  reclamoId: string;

  @CambioEstadoAreaIdField()
  areaId: string;

  @CambioEstadoEstadoField()
  estado: Estados;

  @CambioEstadoDescripcionField()
  descripcion: string;
}
