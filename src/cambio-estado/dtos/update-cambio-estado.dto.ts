import { PartialType } from '@nestjs/swagger';
import { CreateCambioEstadoDTO } from './create-cambio-estado.dto';

export class UpdateCambioEstadoDTO extends PartialType(CreateCambioEstadoDTO) {}
