import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsMongoId,
} from 'class-validator';

// -----------------------------
// Nombre del proyecto
// -----------------------------
export function ProyectoNombreField() {
  return applyDecorators(
    ApiProperty({
      example: 'Proyecto 1',
      description: 'El nombre del proyecto.',
      maxLength: 40,
    }),
    IsString({ message: 'El nombre debe ser un texto.' }),
    IsNotEmpty({ message: 'El nombre del proyecto es obligatorio.' }),
    MaxLength(40, { message: 'El nombre no puede superar los 40 caracteres.' }),
    Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9 ]+$/, {
      message: 'El nombre solo puede contener letras, números y espacios.',
    }),
  );
}

// -----------------------------
// Descripción del proyecto
// -----------------------------
export function ProyectoDescripcionField() {
  return applyDecorators(
    ApiProperty({
      example: 'Este proyecto es de prueba',
      description: 'Describe el proyecto.',
      maxLength: 100,
      required: false,
    }),
    IsString({ message: 'La descripción debe ser un texto.' }),
    MaxLength(100, {
      message: 'La descripción no puede superar los 100 caracteres.',
    }),
  );
}

// -----------------------------
// Tipo de proyecto (ID de Mongo)
// -----------------------------
export function ProyectoTipoIdField() {
  return applyDecorators(
    ApiProperty({
      example: '68f0602ae29a2c2e0ff28625',
      description: 'ID del tipo de proyecto (ObjectId de MongoDB).',
    }),
    IsString({ message: 'El ID debe ser un texto.' }),
    IsNotEmpty({ message: 'El ID del tipo de proyecto es obligatorio.' }),
    IsMongoId({ message: 'El ID del tipo de proyecto no es válido.' }),
  );
}
