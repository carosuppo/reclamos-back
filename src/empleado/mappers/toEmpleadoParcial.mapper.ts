import { EmpleadoUpdateData } from '../interfaces/empleado-update.interface';
import { UpdateEmpleadoDto } from '../dto/update.empleado.dto';

export function toEmpleadoUpdateData(
  dto: UpdateEmpleadoDto,
): EmpleadoUpdateData {
  return {
    email: dto.email,
    nombre: dto.nombre,
    telefono: dto.telefono,
  };
}
