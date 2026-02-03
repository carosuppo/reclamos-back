import {
  IsValidEmail,
  IsValidPassword,
} from '../../common/decorators/swaggers/dto.swagger';

export class LoginDTO {
  @IsValidEmail()
  email!: string;

  @IsValidPassword(6, 18) // Mín caracteres, Máx caracteres
  contraseña!: string;
}
