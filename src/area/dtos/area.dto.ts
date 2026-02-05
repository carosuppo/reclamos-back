import {
  IsValidDescription,
  IsValidId,
  IsValidName,
} from '../../common/decorators/swaggers/dto.swagger';

export class AreaDTO {
  @IsValidId('Área') // Nombre de la tabla
  id!: string;

  @IsValidName(
    50, // Max carácteres
    'Ventas', // Ejemplo
    'Nombre del área', // Descripción
  )
  nombre!: string;

  @IsValidDescription(
    100, // Max carácteres
    false, // Requerido
    'Área encargada de las ventas', // Ejemplo
    'Descripción del área', // Descripción
  )
  descripcion?: string;
}
