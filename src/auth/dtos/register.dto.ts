import {
  ContraseñaField,
  EmailField,
  NombreField,
  TelefonoField,
} from '../swaggers/auth.dto.swagger';

export class RegisterDto {
  @EmailField()
  email!: string;

  @ContraseñaField()
  contraseña!: string;

  @NombreField()
  nombre!: string;

  @TelefonoField()
  telefono!: string;
}
