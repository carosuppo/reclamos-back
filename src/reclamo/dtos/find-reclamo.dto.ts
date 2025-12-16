import { Estados } from '@prisma/client';
import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export class FindReclamoDto {
  @IsOptional()
  @IsEnum(Estados)
  estado?: Estados;

  @IsOptional()
  @IsString()
  clienteId?: string;

  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @IsOptional()
  @IsDateString()
  fechaHasta?: string;
}
