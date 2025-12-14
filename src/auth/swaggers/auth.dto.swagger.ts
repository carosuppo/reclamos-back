import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

// -----------------------------
// Email del usuario
// -----------------------------
export function EmailField() {
  return applyDecorators(
    ApiProperty({
      example: 'usuario@example.com',
      description: 'Correo electrónico del usuario',
    }),
    IsEmail({}, { message: 'El email debe tener un formato válido.' }),
    IsNotEmpty({ message: 'El email es obligatorio.' }),
  );
}

// -----------------------------
// Contraseña del usuario
// -----------------------------
export function ContraseñaField() {
  return applyDecorators(
    ApiProperty({
      example: '123456',
      description: 'Contraseña del usuario',
      minLength: 6,
    }),
    IsString({ message: 'La contraseña debe ser un texto.' }),
    IsNotEmpty({ message: 'La contraseña es obligatoria.' }),
    MinLength(6, {
      message: 'La contraseña debe tener al menos 6 caracteres.',
    }),
  );
}

// -----------------------------
// Nombre del usuario
// -----------------------------
export function NombreField() {
  return applyDecorators(
    ApiProperty({
      example: 'Thomas Moreno',
      description: 'Nombre completo del usuario',
      maxLength: 50,
    }),
    IsString({ message: 'El nombre debe ser un texto.' }),
    IsNotEmpty({ message: 'El nombre es obligatorio.' }),
    Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ ]+$/, {
      message: 'El nombre solo puede contener letras y espacios.',
    }),
  );
}

// -----------------------------
// Teléfono del usuario
// -----------------------------
export function TelefonoField() {
  return applyDecorators(
    ApiProperty({
      example: '353435345',
      description: 'Teléfono del usuario',
      maxLength: 20,
    }),
    IsString({ message: 'El teléfono debe ser un texto.' }),
    IsNotEmpty({ message: 'El teléfono es obligatorio.' }),
    Matches(/^[0-9]+$/, {
      message: 'El teléfono solo puede contener números.',
    }),
  );
}
