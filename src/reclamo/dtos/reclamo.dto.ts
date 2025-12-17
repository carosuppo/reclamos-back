import { Estados } from '@prisma/client';
import { Medidas } from 'src/common/enums/medidas.enum';
import {
  ReclamoAreaField,
  ReclamoCriticidadField,
  ReclamoDescripcionField,
  ReclamoEstadoField,
  ReclamoIdField,
  ReclamoPrioridadField,
  ReclamoProyectoField,
  ReclamoTipoField,
} from '../swaggers/reclamo.dto.swagger';

export class ReclamoDto {
  @ReclamoIdField()
  id: string;

  @ReclamoTipoField()
  tipoReclamo: string;

  @ReclamoProyectoField()
  proyecto: string;

  @ReclamoPrioridadField()
  prioridad: Medidas;

  @ReclamoCriticidadField()
  criticidad: Medidas;

  @ReclamoDescripcionField()
  descripcion: string;

  @ReclamoEstadoField()
  estado: Estados;

  @ReclamoAreaField()
  areaId?: string;
}
