import { Estados } from '@prisma/client';
import {
  ReclamoDescripcionField,
  ReclamoEstadoField,
} from '../swaggers/reclamo.dto.swagger';

export class UpdateEstadoDto {
  @ReclamoDescripcionField()
  descripcion: string;

  @ReclamoEstadoField()
  estado: Estados;
}
