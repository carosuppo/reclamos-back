import { Estados } from '@prisma/client';
import {
  IsValidDescription,
  IsValidEnum,
} from '../../common/decorators/swaggers/dto.swagger';

export class UpdateEstadoDTO {
  @IsValidDescription(
    100, // Máx caracteres
    true, // Requerido?
    'En proceso de solución', // Ejemplo
    'Descripción del estado del reclamo', // Descripción
  )
  descripcion: string; // Descripción que explica el cambio de estado

  @IsValidEnum('Estado', Estados) // Nombre del enum y posibles valores
  estado: Estados;
}
