import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAreaDto {
  @ApiProperty({
    example: 'Ventas',
    description: 'Nombre del área',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;
  @ApiProperty({
    example: 'Área encargada de las ventas',
    description: 'Descripción del área',
    required: false,
  })
  @IsString()
  @IsOptional()
  descripcion?: string;
}
