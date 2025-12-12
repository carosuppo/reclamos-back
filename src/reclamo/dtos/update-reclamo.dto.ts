import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Medidas } from '../../common/enums/medidas.enum';

export class UpdateReclamoDto {
  @IsString()
  @IsOptional()
  tipoReclamoId?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(Medidas)
  @IsOptional()
  prioridad?: Medidas;

  @IsEnum(Medidas)
  @IsOptional()
  criticidad?: Medidas;

  @IsString()
  area: string;
}
