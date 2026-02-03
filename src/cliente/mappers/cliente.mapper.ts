import { Cliente } from '@prisma/client';
import { RegisterDTO } from '../../auth/dtos/register.dto';
import { AuthDTO } from '../../common/dtos/auth.dto';
import { Role } from '../../common/enums/role.enum';
import { ClienteDTO } from '../dtos/cliente.dto';
import { UpdateClienteDTO } from '../dtos/update.cliente.dto';
import {
  ClienteCreateData,
  ClienteUpdateData,
} from '../interfaces/cliente.interface';

export const ClienteMapper = {
  // Toma la información de la base de datos y la pasa a formato DTO
  toClienteDTO(cliente: Cliente): ClienteDTO {
    return {
      id: cliente.id,
      email: cliente.email,
      telefono: cliente.telefono,
      nombre: cliente.nombre,
    };
  },

  // Toma la información del DTO y la pasa a formato valído para su método (Crear cliente)
  toClienteCreateData(dto: RegisterDTO): ClienteCreateData {
    return {
      email: dto.email,
      contraseña: dto.contraseña,
      nombre: dto.nombre,
      telefono: dto.telefono,
      role: Role.CLIENTE,
    };
  },

  // Toma la información del DTO y la pasa a formato válido para su método (Actualizar cliente)
  toClienteUpdateData(id: string, dto: UpdateClienteDTO): ClienteUpdateData {
    return {
      id: id,
      email: dto.email,
      nombre: dto.nombre,
      telefono: dto.telefono,
    };
  },

  // Toma la información de la base de datos y la pasa a formato DTO (Con rol cliente)
  toAuthClienteDTO(cliente: Cliente): AuthDTO {
    return {
      id: cliente.id,
      email: cliente.email,
      contraseña: cliente.contraseña,
      role: Role.CLIENTE,
    };
  },
};
