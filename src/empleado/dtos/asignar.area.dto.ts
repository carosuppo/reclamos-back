import { EmpleadoAsignarAreaField } from '../swaggers/empleado.dto.swagger';

export class AsignarAreaDto {
  @EmpleadoAsignarAreaField()
  area!: string;
}
