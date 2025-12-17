import {
  AreaDescripcionField,
  AreaNombreField,
} from '../swaggers/area.dto.swagger';

export class CreateAreaDto {
  @AreaNombreField()
  nombre!: string;

  @AreaDescripcionField()
  descripcion?: string;
}
