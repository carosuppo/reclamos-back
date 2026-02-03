import {
  IsValidDescription,
  IsValidId,
  IsValidName,
} from '../../common/decorators/swaggers/dto.swagger';

export class TipoReclamoDTO {
  @IsValidId('Tipo de reclamo') // Nombre de la tabla
  id!: string;

  @IsValidName(40, 'Nombre del tipo de reclamo', 'Nombre del tipo de reclamo') // Máx carácteres, Ejemplo, Descripción
  nombre!: string;

  @IsValidDescription(
    100, // Máx carácteres
    false, // Requerido o no
    'Descripción', // Ejemplo
    'Descripción del tipo de reclamo', // Descripción
  )
  descripcion?: string;
}
