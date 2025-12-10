import { RegisterDto } from '../../auth/dto/register.dto';
import { ClienteCreateData } from '../interfaces/cliente-create.interface';
import { Role } from '../../common/enums/role.enum';

export function toClienteEntity(dto: RegisterDto): ClienteCreateData {
  return {
    email: dto.email,
    contraseña: dto.contraseña,
    nombre: dto.nombre,
    telefono: dto.telefono,
    role: Role.CLIENTE,
  };
}
