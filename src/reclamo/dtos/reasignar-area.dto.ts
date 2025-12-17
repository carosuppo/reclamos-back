import {
  ReclamoDescripcionField,
  ReclamoReasignarAreaField,
} from '../swaggers/reclamo.dto.swagger';

export class ReasignarAreaDto {
  @ReclamoDescripcionField()
  descripcion: string;

  @ReclamoReasignarAreaField()
  areaId: string;
}
