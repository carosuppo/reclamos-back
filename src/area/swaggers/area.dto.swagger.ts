import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

// -----------------------------
// ID del área
// -----------------------------
export function AreaIdField() {
  return applyDecorators(
    ApiProperty({
      example: '123e4567-e89b-12d3-a456-426614174000',
      description: 'ID del área',
    }),
    IsString({ message: 'El ID del área debe ser un texto.' }),
    IsNotEmpty({ message: 'El ID del área es obligatorio.' }),
  );
}

// -----------------------------
// Nombre del área
// -----------------------------
export function AreaNombreField() {
  return applyDecorators(
    ApiProperty({
      example: 'Ventas',
      description: 'Nombre del área',
      maxLength: 50,
    }),
    IsString({ message: 'El nombre del área debe ser un texto.' }),
    IsNotEmpty({ message: 'El nombre del área es obligatorio.' }),
    MaxLength(50, {
      message: 'El nombre del área no puede superar los 50 caracteres.',
    }),
  );
}

// -----------------------------
// Descripción del área
// -----------------------------
export function AreaDescripcionField() {
  return applyDecorators(
    ApiProperty({
      example: 'Área encargada de las ventas',
      description: 'Descripción del área',
      required: false,
      maxLength: 100,
    }),
    IsString({ message: 'La descripción debe ser un texto.' }),
    IsOptional(),
    MaxLength(100, {
      message: 'La descripción no puede superar los 100 caracteres.',
    }),
  );
}
