import {
  IsValidEmail,
  IsValidId,
  IsValidName,
  IsValidTelephone,
} from '../../common/decorators/swaggers/dto.swagger';

export class EmpleadoDTO {
  @IsValidId('Empleado') // Nombre de la tabla
  id: string;

  @IsValidEmail()
  email: string;

  @IsValidTelephone()
  telefono: string;

  @IsValidName(50, 'Juan Pérez', 'Nombre del empleado') // Máx carácteres, Ejemplo, Descripción
  nombre: string;

  @IsValidId('Empleado', false) // Nombre de la tabla y si es requerido o no
  area: string;
}
