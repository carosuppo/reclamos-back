import {
  IsValidDescription,
  IsValidEnum,
  IsValidId,
} from '../../common/decorators/swaggers/dto.swagger';
import { Medidas } from '../../common/enums/medidas.enum';

export class UpdateReclamoDTO {
  @IsValidId('Tipo de reclamo', false) // Nombre de la tabla, Requerido?
  tipoReclamoId?: string;

  @IsValidId('Área', false)
  areaId?: string;

  @IsValidDescription(
    100, // Máx caracteres
    false, // Requerido?
    'Descripción del reclamo', // Ejemplo
    'Descripción detallada del reclamo', // Descripción
  )
  descripcion: string;

  @IsValidEnum('Prioridad', Medidas, false) // Nombre del enum y posibles valores
  prioridad?: Medidas;

  @IsValidEnum('Criticidad', Medidas, false)
  criticidad?: Medidas;
}
