import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export function TipoReclamoIdField() {
  return applyDecorators(
    ApiProperty({
      example: '123e4567-e89b-12d3-a456-426614174000',
      description: 'ID del tipo de reclamo',
      required: true,
    }),
    IsString({ message: 'El ID debe ser un texto' }),
    IsNotEmpty({ message: 'El ID del tipo de reclamo es obligatorio' }),
  );
}

export function TipoReclamoNombreField() {
  return applyDecorators(
    ApiProperty({
      example: 'Queja',
      description: 'Nombre del tipo de reclamo',
      required: true,
    }),
    IsString({ message: 'El nombre debe ser un texto' }),
    IsNotEmpty({ message: 'El nombre del tipo de reclamo es obligatorio' }),
  );
}

export function TipoReclamoDescripcionField() {
  return applyDecorators(
    ApiProperty({
      example: 'Tipo de reclamo relacionado con el servicio al cliente',
      description: 'Descripción del tipo de reclamo',
      required: false,
    }),
    IsString({ message: 'La descripción debe ser un texto' }),
    IsOptional(),
  );
}
