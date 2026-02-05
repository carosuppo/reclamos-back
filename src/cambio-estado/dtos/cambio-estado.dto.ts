import { Estados } from '@prisma/client';
import {
  IsValidDate,
  IsValidDescription,
  IsValidEnum,
  IsValidId,
} from '../../common/decorators/swaggers/dto.swagger';

export class CambioEstadoDTO {
  @IsValidId('Cambio estado') // Nombre de la tabla
  id: string;

  @IsValidId('Reclamo')
  reclamoId: string;

  @IsValidId('Área')
  areaId: string;

  @IsValidDate()
  fechaInicio: Date;

  @IsValidDate()
  fechaFin: Date | null;

  @IsValidDescription(
    100, // Máx caracteres
    false, // Requerido o no
    'Descripción', // Ejemplo
    'Descripción del cambio de estado', // Descripción
  )
  descripcion: string | null;

  @IsValidEnum('Estado', Estados) // Nombre del enum y posibles valores
  estado: Estados;

  @IsValidId('Empleado', false) // Nombre de la tabla y si es requerido o no
  empleadoId: string | null;

  @IsValidId('Cliente', false)
  clienteId: string | null;
}
