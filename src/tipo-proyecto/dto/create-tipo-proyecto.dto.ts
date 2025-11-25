import {
  TipoProyectoDescripcionField,
  TipoProyectoNombreField,
} from '../swagger/tipo-proyecto-dto.swagger';

export class CreateTipoProyectoDto {
  @TipoProyectoNombreField()
  nombre!: string;

  @TipoProyectoDescripcionField()
  descripcion?: string;
}
