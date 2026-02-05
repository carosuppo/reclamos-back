import { Empleado } from '@prisma/client';
import { RegisterDTO } from '../../auth/dtos/register.dto';
import { AuthDTO } from '../../common/dtos/auth.dto';
import { Role } from '../../common/enums/role.enum';
import { EmpleadoDTO } from '../dtos/empleado.dto';
import { UpdateEmpleadoDTO } from '../dtos/update-empleado.dto';
import {
  EmpleadoCreateData,
  EmpleadoUpdateData,
} from '../interfaces/empleado.interface';

export const EmpleadoMapper = {
  // Toma la información de la base de datos y la pasa a formato DTO
  toEmpleadoDTO(empleado: Empleado): EmpleadoDTO {
    return {
      id: empleado.id,
      email: empleado.email,
      telefono: empleado.telefono,
      nombre: empleado.nombre,
      area: empleado.areaId ?? '',
    };
  },

  // Toma la información del DTO y la pasa a formato válido para su método (Crear empleado)
  toEmpleadoEntity(dto: RegisterDTO): EmpleadoCreateData {
    return {
      email: dto.email,
      contraseña: dto.contraseña,
      nombre: dto.nombre,
      telefono: dto.telefono,
      role: Role.EMPLEADO,
    };
  },

  // Toma la información del DTO y la pasa a formato valído para su método (Actualizar empleado)
  toEmpleadoUpdateData(id: string, dto: UpdateEmpleadoDTO): EmpleadoUpdateData {
    return {
      id: id,
      email: dto.email,
      nombre: dto.nombre,
      telefono: dto.telefono,
    };
  },

  // Toma la información de la base de datos y la pasa a formato DTO (Con rol empleado)
  toAuthEmpleadoDTO(empleado: Empleado): AuthDTO {
    return {
      id: empleado.id,
      email: empleado.email,
      contraseña: empleado.contraseña,
      role: Role.EMPLEADO,
    };
  },
};
