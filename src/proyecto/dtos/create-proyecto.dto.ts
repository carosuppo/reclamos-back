import { PartialType } from '@nestjs/swagger';
import {
  IsValidDescription,
  IsValidId,
  IsValidName,
} from '../../common/decorators/swaggers/dto.swagger';

export class CreateProyectoDTO {
  @IsValidName(40, 'Proyecto 1', 'Nombre del proyecto') // Máx carácteres, ejemplo, descripción
  nombre!: string;

  @IsValidDescription(
    150, // Máx carácteres
    false, // Requerido o no
    'Desarrollo de Software', // Ejemplo
    'Descripción del proyecto', // Descripción
  )
  descripcion?: string;

  @IsValidId('TipoProyecto') // Nombre de la tabla
  tipoProyectoId!: string;
}

export class UpdateProyectoDTO extends PartialType(CreateProyectoDTO) {}
