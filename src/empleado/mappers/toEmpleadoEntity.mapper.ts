import { RegisterDto } from '../../auth/dtos/register.dto';
import { Role } from '../../common/enums/role.enum';
import { EmpleadoCreateData } from '../interfaces/empleado-create.interface';

export function toEmpleadoEntity(dto: RegisterDto): EmpleadoCreateData {
  return {
    email: dto.email,
    contraseña: dto.contraseña,
    nombre: dto.nombre,
    telefono: dto.telefono,
    role: Role.EMPLEADO,
  };
}
