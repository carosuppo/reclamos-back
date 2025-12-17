import { Medidas } from 'src/common/enums/medidas.enum';
import {
  ReclamoAreaField,
  ReclamoCriticidadField,
  ReclamoDescripcionField,
  ReclamoPrioridadField,
  ReclamoProyectoField,
  ReclamoTipoField,
} from '../swaggers/reclamo.dto.swagger';

export class CreateReclamoDto {
  @ReclamoTipoField()
  tipoReclamoId: string;

  @ReclamoDescripcionField()
  descripcion: string;

  @ReclamoPrioridadField()
  prioridad: Medidas;

  @ReclamoCriticidadField()
  criticidad: Medidas;

  @ReclamoAreaField()
  areaId: string;

  @ReclamoProyectoField()
  proyectoId: string;
}
