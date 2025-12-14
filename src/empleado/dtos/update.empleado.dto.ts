import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateEmpleadoDto {
  @ApiPropertyOptional({
    example: 'nuevo-correo@example.com',
    description: 'Nuevo correo del empleado. Debe ser un email válido.',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'Juan Pérez',
    description: 'Nuevo nombre del empleado.',
  })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({
    example: '3516789900',
    description: 'Nuevo número de teléfono del empleado.',
  })
  @IsOptional()
  @IsString()
  telefono?: string;
}
