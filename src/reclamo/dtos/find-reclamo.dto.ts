import { Estados } from '@prisma/client';
import { IsOptional } from 'class-validator';
import {
  ReclamoAreaField,
  ReclamoEstadoField,
  ReclamoFechaField,
} from '../swaggers/reclamo.dto.swagger';

export class FindReclamoDto {
  @IsOptional()
  @ReclamoEstadoField()
  estado?: Estados;

  @IsOptional()
  @ReclamoAreaField()
  clienteId?: string;

  @IsOptional()
  @ReclamoFechaField('Fecha desde para filtrar reclamos')
  fechaDesde?: string;

  @IsOptional()
  @ReclamoFechaField('Fecha hasta para filtrar reclamos')
  fechaHasta?: string;
}
