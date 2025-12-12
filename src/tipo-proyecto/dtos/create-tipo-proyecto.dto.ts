import {
  TipoProyectoDescripcionField,
  TipoProyectoNombreField,
} from '../swaggers/tipo-proyecto-dto.swagger';

export class CreateTipoProyectoDto {
  @TipoProyectoNombreField()
  nombre!: string;

  @TipoProyectoDescripcionField()
  descripcion?: string;
}
