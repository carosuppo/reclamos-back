import { Role } from 'src/common/enums/role.enum';
import { UsuarioCreateData } from '../../common/interfaces/usuario-create.interface';

export interface EmpleadoCreateData extends UsuarioCreateData {
  role: Role.EMPLEADO;
}
