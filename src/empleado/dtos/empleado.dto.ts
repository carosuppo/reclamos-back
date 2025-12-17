import { AreaDto } from '../../area/dtos/area.dto';
import {
  EmpleadoAreaField,
  EmpleadoEmailField,
  EmpleadoIdField,
  EmpleadoNombreField,
  EmpleadoTelefonoField,
} from '../swaggers/empleado.dto.swagger';

export class EmpleadoDto {
  @EmpleadoIdField()
  id: string;

  @EmpleadoEmailField()
  email: string;

  @EmpleadoTelefonoField()
  telefono: string;

  @EmpleadoNombreField()
  nombre: string;

  @EmpleadoAreaField()
  area: AreaDto | null;
}
