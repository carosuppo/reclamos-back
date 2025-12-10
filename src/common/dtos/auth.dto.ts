import { Role } from '../enums/role.enum';

export class AuthDto {
  id: string;
  contraseña: string;
  email: string;
  role: Role;
}
