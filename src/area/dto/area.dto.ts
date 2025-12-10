import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AreaDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del área',
    required: true,
  })
  @IsString()
  id!: string;

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
    description: 'Descripción del producto',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
