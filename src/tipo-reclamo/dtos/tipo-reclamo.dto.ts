import {
  TipoReclamoDescripcionField,
  TipoReclamoIdField,
  TipoReclamoNombreField,
} from '../swaggers/tipo-reclamo.dto.swagger';

export class TipoReclamoDto {
  @TipoReclamoIdField()
  id!: string;

  @TipoReclamoNombreField()
  nombre!: string;

  @TipoReclamoDescripcionField()
  descripcion?: string;
}
