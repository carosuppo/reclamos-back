import { Estados } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';

export class UpdateEstadoDto {
  @IsString()
  descripcion: string;
  @IsEnum(Estados)
  estado: Estados;
}
