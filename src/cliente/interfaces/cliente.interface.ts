import { Role } from '../../common/enums/role.enum';
import { UsuarioCreateData } from '../../common/interfaces/usuario.interface';

export interface ClienteCreateData extends UsuarioCreateData {
  role: Role.CLIENTE;
}

export interface ClienteUpdateData {
  id: string;
  email?: string;
  nombre?: string;
  telefono?: string;
}
