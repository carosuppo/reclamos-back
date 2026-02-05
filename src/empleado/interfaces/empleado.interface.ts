import { Role } from '../../common/enums/role.enum';
import { UsuarioCreateData } from '../../common/interfaces/usuario.interface';

export interface EmpleadoCreateData extends UsuarioCreateData {
  role: Role.EMPLEADO;
}

export interface EmpleadoUpdateData {
  id: string;
  email?: string;
  nombre?: string;
  telefono?: string;
}
