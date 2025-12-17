import {
  AreaDescripcionField,
  AreaIdField,
  AreaNombreField,
} from '../swaggers/area.dto.swagger';

export class AreaDto {
  @AreaIdField()
  id!: string;

  @AreaNombreField()
  nombre!: string;

  @AreaDescripcionField()
  descripcion?: string;
}
