import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TipoReclamoDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID del tipo de reclamo',
    required: true,
  })
  @IsString()
  id!: string;

  @ApiProperty({
    example: 'Queja',
    description: 'Nombre del tipo de reclamo',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @ApiProperty({
    example: 'Tipo de reclamo relacionado con el servicio al cliente',
    description: 'Descripción del tipo de reclamo',
    required: false,
  })
  @IsOptional()
  @IsString()
  descripcion?: string;
}
