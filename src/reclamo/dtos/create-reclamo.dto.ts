import { IsString, IsEnum } from 'class-validator';
import { Medidas } from 'src/common/enums/medidas.enum';

export class CreateReclamoDto {
  @IsString()
  tipoReclamoId: string;

  @IsString()
  descripcion: string;

  @IsEnum(Medidas)
  prioridad: Medidas;

  @IsEnum(Medidas)
  criticidad: Medidas;

  @IsString()
  areaId: string;

  @IsString()
  proyectoId: string;
}
