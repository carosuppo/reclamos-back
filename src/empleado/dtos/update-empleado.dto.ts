import {
  IsValidEmail,
  IsValidName,
  IsValidTelephone,
} from '../../common/decorators/swaggers/dto.swagger';

export class UpdateEmpleadoDTO {
  @IsValidEmail(false) // Requerido?
  email?: string;

  @IsValidName(50, 'Ana Gómez', 'Nuevo nombre del empleado', false) // Máx carácteres, Ejemplo, Descripción, Requerido?
  nombre?: string;

  @IsValidTelephone(false) // Requerido?
  telefono?: string;
}
