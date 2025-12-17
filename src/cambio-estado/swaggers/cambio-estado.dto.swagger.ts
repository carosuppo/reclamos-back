import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsMongoId,
  IsEnum,
} from 'class-validator';
import { Estados } from '@prisma/client';

// -----------------------------
// ID del cambio de estado
// -----------------------------
export function CambioEstadoIdField() {
  return applyDecorators(
    ApiProperty({
      example: '68f0602ae29a2c2e0ff28630',
      description: 'ID del cambio de estado',
    }),
    IsString({ message: 'El ID debe ser un texto.' }),
    IsNotEmpty({ message: 'El ID es obligatorio.' }),
  );
}

// -----------------------------
// Reclamo ID
// -----------------------------
export function CambioEstadoReclamoIdField() {
  return applyDecorators(
    ApiProperty({
      example: '68f0602ae29a2c2e0ff28625',
      description: 'ID del reclamo asociado',
    }),
    IsString({ message: 'El ID del reclamo debe ser un texto.' }),
    IsNotEmpty({ message: 'El ID del reclamo es obligatorio.' }),
    IsMongoId({ message: 'El ID del reclamo no es válido.' }),
  );
}

// -----------------------------
// Área ID
// -----------------------------
export function CambioEstadoAreaIdField() {
  return applyDecorators(
    ApiProperty({
      example: '68f0602ae29a2c2e0ff28626',
      description: 'ID del área asociada',
    }),
    IsString({ message: 'El ID del área debe ser un texto.' }),
    IsNotEmpty({ message: 'El ID del área es obligatorio.' }),
    IsMongoId({ message: 'El ID del área no es válido.' }),
  );
}

// -----------------------------
// Estado
// -----------------------------
export function CambioEstadoEstadoField() {
  return applyDecorators(
    ApiProperty({
      example: Estados.PENDIENTE,
      description: 'Estado del reclamo',
      enum: Estados,
    }),
    IsEnum(Estados, {
      message: 'El estado debe ser un valor válido del enum Estados.',
    }),
  );
}

// -----------------------------
// Descripción
// -----------------------------
export function CambioEstadoDescripcionField(required = true) {
  return applyDecorators(
    ApiProperty({
      example: 'El reclamo fue asignado al área correspondiente',
      description: 'Descripción del cambio de estado',
      required,
    }),
    IsString({ message: 'La descripción debe ser un texto.' }),
    required
      ? IsNotEmpty({ message: 'La descripción es obligatoria.' })
      : IsOptional(),
  );
}

// -----------------------------
// Empleado ID
// -----------------------------
export function CambioEstadoEmpleadoIdField() {
  return applyDecorators(
    ApiProperty({
      example: '68f0602ae29a2c2e0ff28640',
      description: 'ID del empleado',
      required: false,
    }),
    IsString({ message: 'El ID del empleado debe ser un texto.' }),
    IsOptional(),
    IsMongoId({ message: 'El ID del empleado no es válido.' }),
  );
}

// -----------------------------
// Cliente ID
// -----------------------------
export function CambioEstadoClienteIdField() {
  return applyDecorators(
    ApiProperty({
      example: '68f0602ae29a2c2e0ff28650',
      description: 'ID del cliente',
      required: false,
    }),
    IsString({ message: 'El ID del cliente debe ser un texto.' }),
    IsOptional(),
    IsMongoId({ message: 'El ID del cliente no es válido.' }),
  );
}

// -----------------------------
// Fecha inicio
// -----------------------------
export function CambioEstadoFechaInicioField() {
  return applyDecorators(
    ApiProperty({
      example: '2025-01-15T10:30:00.000Z',
      description: 'Fecha de inicio del estado',
    }),
  );
}

// -----------------------------
// Fecha fin
// -----------------------------
export function CambioEstadoFechaFinField() {
  return applyDecorators(
    ApiProperty({
      example: '2025-01-16T12:00:00.000Z',
      description: 'Fecha de fin del estado',
      required: false,
    }),
  );
}
