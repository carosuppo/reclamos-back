import { ContraseñaField, EmailField } from '../swaggers/auth.dto.swagger';

export class LoginDto {
  @EmailField()
  email!: string;

  @ContraseñaField()
  contraseña!: string;
}
