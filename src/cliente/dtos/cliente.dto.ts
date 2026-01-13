import {
  IsValidEmail,
  IsValidId,
  IsValidName,
  IsValidTelephone,
} from '../../common/decorators/swaggers/dto.swagger';

export class ClienteDTO {
  @IsValidId('Cliente') // Nombre de la tabla
  id: string;

  @IsValidEmail()
  email: string;

  @IsValidTelephone()
  telefono: string;

  @IsValidName(50, 'Thomas Moreno', 'Nombre del cliente') // Máx carácteres, Ejemplo, Descripción
  nombre: string;
}
