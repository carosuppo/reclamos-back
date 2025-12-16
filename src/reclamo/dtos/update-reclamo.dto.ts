import { IsOptional } from 'class-validator';
import { Medidas } from '../../common/enums/medidas.enum';
import {
  ReclamoAreaField,
  ReclamoCriticidadField,
  ReclamoDescripcionField,
  ReclamoPrioridadField,
  ReclamoTipoField,
} from '../swaggers/reclamo.dto.swagger';

export class UpdateReclamoDto {
  @IsOptional()
  @ReclamoTipoField()
  tipoReclamoId?: string;

  @IsOptional()
  @ReclamoAreaField()
  areaId?: string;

  @IsOptional()
  @ReclamoDescripcionField()
  descripcion: string;

  @IsOptional()
  @ReclamoPrioridadField()
  prioridad?: Medidas;

  @IsOptional()
  @ReclamoCriticidadField()
  criticidad?: Medidas;
}
