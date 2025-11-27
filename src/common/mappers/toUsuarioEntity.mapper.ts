import { RegisterDto } from 'src/auth/dto/register.dto';
import { UsuarioCreateData } from 'src/common/interfaces/usuario-create.interface';

export function toUsuarioEntity(dto: RegisterDto): UsuarioCreateData {
  return {
    email: dto.email,
    contraseña: dto.contraseña,
    nombre: dto.nombre,
    telefono: dto.telefono,
  };
}
