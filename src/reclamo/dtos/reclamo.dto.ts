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
import { ApiProperty } from '@nestjs/swagger';

export class ReclamoDto {
  @ReclamoIdField()
  id: string;

  @ReclamoTipoField()
  tipoReclamo: string;

  @ApiProperty({ description: 'Nombre del proyecto' })
  proyectoNombre?: string;

  @ApiProperty({ description: 'Nombre del cliente' })
  clienteNombre?: string;

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

  @ApiProperty({ description: 'Fecha de creación' })
  createdAt: Date;

  @ApiProperty({ description: 'Ultima actualización' })
  updatedAt: Date;
}
