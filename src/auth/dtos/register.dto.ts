import {
  IsValidEmail,
  IsValidName,
  IsValidPassword,
  IsValidTelephone,
} from '../../common/decorators/swaggers/dto.swagger';

export class RegisterDTO {
  @IsValidEmail()
  email!: string;

  @IsValidPassword(6, 18) // Mín carácteres, Max carácteres
  contraseña!: string;

  @IsValidName(
    50, //Max carácteres
    'Juan Pérez', // Ejemplo
    'Nombre completo del usuario', // Descripción
  )
  nombre!: string;

  @IsValidTelephone()
  telefono!: string;
}
