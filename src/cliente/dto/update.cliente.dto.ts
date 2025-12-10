import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateClienteDto {
  @ApiPropertyOptional({
    example: 'nuevo-correo@example.com',
    description: 'Nuevo correo del cliente. Debe ser un email válido.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Juan Pérez',
    description: 'Nuevo nombre del cliente.',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: '3516789900',
    description: 'Nuevo número de teléfono del cliente.',
  })
  @IsOptional()
  @IsString()
  telefono?: string;
}
