import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

// --------------------------------------------------------
// Nombre del Tipo de Proyecto
// --------------------------------------------------------
export function TipoProyectoNombreField() {
  return applyDecorators(
    ApiProperty({
      example: 'Desarrollo de Software',
      description: 'Nombre del tipo de proyecto.',
      maxLength: 40,
      pattern: '^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9 ]+$',
    }),
    IsString({ message: 'El nombre debe ser un texto.' }),
    IsNotEmpty({ message: 'El nombre no puede estar vacío.' }),
    MaxLength(40, { message: 'El nombre no puede superar 40 caracteres.' }),
    Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9 ]+$/, {
      message: 'El nombre solo puede contener letras, números y espacios.',
    }),
  );
}

// --------------------------------------------------------
// Descripción del tipo de proyecto
// --------------------------------------------------------
export function TipoProyectoDescripcionField() {
  return applyDecorators(
    ApiProperty({
      example: 'Tipo de proyecto enfocado en el desarrollo de aplicaciones.',
      description: 'Descripción del tipo de proyecto.',
      maxLength: 100,
    }),
    IsString({ message: 'La descripción debe ser un texto.' }),
    IsOptional(),
    MaxLength(100, {
      message: 'La descripción no puede superar los 100 caracteres.',
    }),
  );
}
