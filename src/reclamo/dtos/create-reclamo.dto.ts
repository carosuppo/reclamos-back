import {
  IsValidDescription,
  IsValidEnum,
  IsValidId,
} from '../../common/decorators/swaggers/dto.swagger';
import { Medidas } from '../../common/enums/medidas.enum';

export class CreateReclamoDTO {
  @IsValidId('Tipo de reclamo') // Nombre de la tabla
  tipoReclamoId: string;

  @IsValidId('Proyecto')
  proyectoId: string;

  @IsValidId('Área')
  areaId: string;

  @IsValidDescription(
    80, // Máx caracteres
    true, // Requerido?
    'Falla en el sistema', // Ejemplo
    'Descripción del reclamo', // Descripción
  )
  descripcion: string;

  @IsValidEnum('Prioridad', Medidas) // Nombre del enum y posibles valores
  prioridad: Medidas;

  @IsValidEnum('Criticidad', Medidas)
  criticidad: Medidas;
}
