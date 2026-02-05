import { Role } from '../enums/role.enum';

export class AuthDTO {
  id: string;
  contraseña: string;
  email: string;
  role: Role;
}
