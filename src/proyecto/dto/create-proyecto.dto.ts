import {
  ProyectoDescripcionField,
  ProyectoNombreField,
  ProyectoTipoIdField,
} from '../swagger/create-proyecto.dto.swagger';

export class CreateProyectoDto {
  @ProyectoNombreField()
  nombre!: string;

  @ProyectoDescripcionField()
  descripcion?: string;

  @ProyectoTipoIdField()
  tipoProyectoId!: string;
}
