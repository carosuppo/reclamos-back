import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Matches } from 'class-validator';

// -----------------------------
// ID del cliente (MongoDB ObjectId)
// -----------------------------
export function ClienteIdField() {
  return applyDecorators(
    ApiProperty({
      example: '6918e2ebf030ce5632e8cac4',
      description: 'Identificador único del cliente',
    }),
    IsString({ message: 'El ID debe ser un texto.' }),
    Matches(/^[0-9a-fA-F]{24}$/, {
      message: 'El ID debe ser un ObjectId válido de MongoDB.',
    }),
  );
}

// -----------------------------
// Email del cliente
// -----------------------------
export function ClienteEmailField() {
  return applyDecorators(
    ApiProperty({
      example: 'cliente@example.com',
      description: 'Correo electrónico del cliente',
    }),
    IsEmail({}, { message: 'El email debe ser válido.' }),
    IsString({ message: 'El email debe ser un texto.' }),
  );
}

// -----------------------------
// Teléfono del cliente
// -----------------------------
export function ClienteTelefonoField() {
  return applyDecorators(
    ApiProperty({
      example: '3514567890',
      description: 'Número de teléfono del cliente',
    }),
    IsString({ message: 'El teléfono debe ser un texto.' }),
    Matches(/^[0-9]+$/, {
      message: 'El teléfono solo puede contener números.',
    }),
  );
}

// -----------------------------
// Nombre del cliente
// -----------------------------
export function ClienteNombreField() {
  return applyDecorators(
    ApiProperty({
      example: 'Thomas Nahuel Moreno',
      description: 'Nombre completo del cliente',
    }),
    IsString({ message: 'El nombre debe ser un texto.' }),
    Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/, {
      message: 'El nombre solo puede contener letras y espacios.',
    }),
  );
}
