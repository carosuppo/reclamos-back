import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Estados } from '@prisma/client';
import { Medidas } from '../../common/enums/medidas.enum';

// -----------------------------
// ID del reclamo
// -----------------------------
export function ReclamoIdField() {
  return applyDecorators(
    ApiProperty({
      example: '123e4567-e89b-12d3-a456-426614174000',
      description: 'ID del reclamo',
    }),
    IsString({ message: 'El ID debe ser un texto.' }),
    IsNotEmpty({ message: 'El ID es obligatorio.' }),
  );
}

// -----------------------------
// Tipo de reclamo
// -----------------------------
export function ReclamoTipoField() {
  return applyDecorators(
    ApiProperty({ example: 'Incidencia', description: 'Tipo de reclamo' }),
    IsString({ message: 'El tipo de reclamo debe ser un texto.' }),
    IsNotEmpty({ message: 'El tipo de reclamo es obligatorio.' }),
  );
}

// -----------------------------
// Proyecto asociado
// -----------------------------
export function ReclamoProyectoField() {
  return applyDecorators(
    ApiProperty({
      example: 'Proyecto 1',
      description: 'Nombre del proyecto asociado',
    }),
    IsString({ message: 'El proyecto debe ser un texto.' }),
    IsNotEmpty({ message: 'El proyecto es obligatorio.' }),
  );
}

// -----------------------------
// Descripción
// -----------------------------
export function ReclamoDescripcionField() {
  return applyDecorators(
    ApiProperty({
      example: 'Descripción del reclamo',
      description: 'Descripción del reclamo',
    }),
    IsString({ message: 'La descripción debe ser un texto.' }),
    IsNotEmpty({ message: 'La descripción es obligatoria.' }),
  );
}

// -----------------------------
// Área asociada
// -----------------------------
export function ReclamoAreaField() {
  return applyDecorators(
    ApiPropertyOptional({
      example: 'Ventas',
      description: 'Área responsable del reclamo',
    }),
    IsOptional(),
    IsString({ message: 'El área debe ser un texto.' }),
  );
}

// -----------------------------
// Estado
// -----------------------------
export function ReclamoEstadoField() {
  return applyDecorators(
    ApiProperty({
      example: Estados.PENDIENTE,
      description: 'Estado actual del reclamo',
      enum: Estados,
    }),
    IsEnum(Estados, { message: 'El estado no es válido.' }),
  );
}

// -----------------------------
// Prioridad
// -----------------------------
export function ReclamoPrioridadField() {
  return applyDecorators(
    ApiProperty({
      example: Medidas.ALTA,
      description: 'Prioridad del reclamo',
      enum: Medidas,
    }),
    IsEnum(Medidas, { message: 'La prioridad no es válida.' }),
  );
}

// -----------------------------
// Criticidad
// -----------------------------
export function ReclamoCriticidadField() {
  return applyDecorators(
    ApiProperty({
      example: Medidas.ALTA,
      description: 'Criticidad del reclamo',
      enum: Medidas,
    }),
    IsEnum(Medidas, { message: 'La criticidad no es válida.' }),
  );
}

// -----------------------------
// Fecha
// -----------------------------
export function ReclamoFechaField(description: string) {
  return applyDecorators(
    ApiPropertyOptional({ example: '2025-12-16', description }),
    IsOptional(),
  );
}

// -----------------------------
// Reasignar área
// -----------------------------
export function ReclamoReasignarAreaField() {
  return applyDecorators(
    ApiProperty({
      example: 'Ventas',
      description: 'ID del área a reasignar',
    }),
    IsString({ message: 'El ID del área debe ser un texto' }),
    IsNotEmpty({ message: 'El ID del área es obligatorio' }),
  );
}
