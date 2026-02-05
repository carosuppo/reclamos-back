import { Estados } from '@prisma/client';
import {
  IsValidDescription,
  IsValidEnum,
  IsValidId,
} from '../../common/decorators/swaggers/dto.swagger';
import { Medidas } from '../../common/enums/medidas.enum';

export class ReclamoDTO {
  @IsValidId('Reclamo') // Nombre de la tabla
  id: string;

  @IsValidId('Tipo de reclamo')
  tipoReclamo: string;

  @IsValidId('Proyecto')
  proyecto: string;

  @IsValidEnum('Prioridad', Medidas) // Nombre del enum y posibles valores
  prioridad: Medidas;

  @IsValidEnum('Criticidad', Medidas)
  criticidad: Medidas;

  @IsValidDescription(
    100, // Máx caracteres
    true, // Requerido?
    'Falla en el sistema', // Ejemplo
    'Descripcion del reclamo', // Descripción
  )
  descripcion: string;

  @IsValidEnum('Estado', Estados)
  estado: Estados;

  @IsValidId('Área', false)
  areaId?: string;
}
