import { PartialType } from '@nestjs/swagger';
import { CreateCambioEstadoDto } from './create-cambio-estado.dto';

export class UpdateCambioEstadoDto extends PartialType(CreateCambioEstadoDto) {}
