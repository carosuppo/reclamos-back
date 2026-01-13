import { Estados } from '@prisma/client';
import {
  IsValidDate,
  IsValidEnum,
  IsValidId,
} from '../../common/decorators/swaggers/dto.swagger';

export class FiltersDTO {
  @IsValidEnum('Estado del reclamo', Estados, false) // Nombre del enum, posibles valores, Requerido?
  estado?: Estados;

  @IsValidId('Cliente', false) // Nombre de la tabla, Requerido?
  clienteId?: string;

  @IsValidDate(false) // Requerido?
  fechaDesde?: string;

  @IsValidDate(false) // Requerido?
  fechaHasta?: string;
}
