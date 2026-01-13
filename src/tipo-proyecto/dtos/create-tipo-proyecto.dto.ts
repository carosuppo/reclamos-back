import { PartialType } from '@nestjs/swagger';
import {
  IsValidDescription,
  IsValidName,
} from '../../common/decorators/swaggers/dto.swagger';

export class CreateTipoProyectoDTO {
  @IsValidName(40, 'Desarrollo de Software', 'Nombre del tipo de proyecto') // Máx carácteres, ejemplo, descripción
  nombre!: string;

  @IsValidDescription(
    100, // Máx carácteres
    false, // Requerido o no
    'Descripción', // Ejemplo
    'Descripción del tipo de proyecto', // Descripción
  )
  descripcion?: string;
}

export class UpdateTipoProyectoDto extends PartialType(CreateTipoProyectoDTO) {}
