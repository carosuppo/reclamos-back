import {
  IsValidEmail,
  IsValidName,
  IsValidTelephone,
} from '../../common/decorators/swaggers/dto.swagger';

export class UpdateClienteDTO {
  @IsValidEmail(false) // Requerido?
  email?: string;

  @IsValidName(50, 'Thomas Moreno', 'Nombre del cliente', false) // Máx carácteres, Ejemplo, Descripción, Requerido?
  nombre?: string;

  @IsValidTelephone(false) // Requerido?
  telefono?: string;
}
