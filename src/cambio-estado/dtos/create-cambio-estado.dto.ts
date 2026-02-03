import { Estados } from '@prisma/client';
import {
  IsValidDescription,
  IsValidEnum,
  IsValidId,
} from '../../common/decorators/swaggers/dto.swagger';

export class CreateCambioEstadoDTO {
  @IsValidId('Cliente', false) // Nombre de la tabla y si es requerido o no
  clienteId?: string;

  @IsValidId('Empleado', false)
  empleadoId?: string;

  @IsValidId('Reclamo') // Nombre de la tabla
  reclamoId: string;

  @IsValidId('Área')
  areaId: string;

  @IsValidEnum('Estado', Estados) // Nombre del enum y posibles valores
  estado: Estados;

  @IsValidDescription(
    100, // Máx caracteres
    false, // Requerido o no
    'Reclamo en proceso', // Ejemplo
    'Descripción del cambio de estado', // Descripción
  )
  descripcion: string;
}
