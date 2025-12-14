import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AsignarAreaDto {
  @ApiPropertyOptional({
    example: 'Ventas',
    description: 'Área de trabajo del empleado.',
  })
  @IsNotEmpty()
  area!: string;
}
