import {
  IsValidDescription,
  IsValidId,
} from '../../common/decorators/swaggers/dto.swagger';

export class ReasignarAreaDTO {
  @IsValidDescription(
    100, // Máx caracteres
    true, // Requerido?
    'Este reclamo lo puede resolver el área de ventas', // Ejemplo
    'Descripción del reclamo', // Descripción
  )
  descripcion: string;

  @IsValidId('Área') // Nombre de la tabla
  areaId: string;
}
