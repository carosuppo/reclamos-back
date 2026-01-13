import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export function IsValidId(name: string, required: boolean = true) {
  return applyDecorators(
    ApiProperty({
      example: '612e3c4f1c4a4b3f2c4e4d5e',
      description: 'ID en formato MongoDB de la entidad ' + name,
    }),
    IsString({ message: 'El ID debe ser un texto.' }),
    required
      ? IsNotEmpty({ message: 'El ID es obligatorio.' })
      : IsOptional({ message: 'El ID es opcional.' }),
    IsMongoId({ message: 'El ID no es valido.' }),
  );
}

export function IsValidDescription(
  maxLength: number,
  required: boolean,
  example: string,
  description: string,
) {
  return applyDecorators(
    ApiProperty({
      example: example,
      description: description,
      required: required,
      maxLength: maxLength,
    }),
    IsString({ message: 'La descripción debe ser un texto.' }),
    required
      ? IsNotEmpty({ message: 'La descripción es obligatoria.' })
      : IsOptional(),
    MaxLength(maxLength, {
      message: `La descripción no puede superar los ${maxLength} caracteres.`,
    }),
  );
}

export function IsValidName(
  maxLength: number,
  name: string,
  description: string,
  required: boolean = true,
) {
  return applyDecorators(
    ApiProperty({
      example: name,
      description: description,
      maxLength: maxLength,
    }),
    IsString({ message: 'El nombre debe ser un texto.' }),
    required
      ? IsNotEmpty({ message: 'El nombre es obligatorio.' })
      : IsOptional(),
    MaxLength(maxLength, {
      message: `El nombre no puede superar los ${maxLength} caracteres.`,
    }),
    Matches(/^[A-Za-zÁÉÍÓÚáéíóúñÑ0-9 ]+$/, {
      message: 'El nombre solo puede contener letras, números y espacios.',
    }),
  );
}

export function IsValidEmail(required: boolean = true) {
  return applyDecorators(
    ApiProperty({
      example: 'usuario@example',
      description: 'Correo electrónico',
    }),
    required
      ? IsNotEmpty({ message: 'El email es obligatorio.' })
      : IsOptional({ message: 'El email es opcional.' }),
    IsString({ message: 'El email debe ser un texto.' }),
    IsNotEmpty({ message: 'El email es obligatorio.' }),
    IsEmail({}, { message: 'El email debe tener un formato válido.' }),
  );
}

export function IsValidPassword(minLength: number, maxLength: number) {
  return applyDecorators(
    ApiProperty({
      example: 'Contraseña123',
      description:
        'Contraseña que debe tener al menos 8 caracteres, incluyendo letras mayúsculas, minúsculas y números.',
    }),
    IsString({ message: 'La contraseña debe ser un texto.' }),
    IsNotEmpty({ message: 'La contraseña es obligatoria.' }),
    MinLength(minLength, {
      message:
        'La contraseña debe tener al menos ' + minLength + ' caracteres.',
    }),
    MaxLength(maxLength, {
      message:
        'La contraseña no puede superar los ' + maxLength + ' caracteres.',
    }),
    Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/, {
      message:
        'La contraseña debe tener caracteres, letras mayúsculas, minúsculas y números.',
    }),
  );
}

export function IsValidTelephone(required: boolean = true) {
  return applyDecorators(
    ApiProperty({
      example: '3534123456',
      description: 'Número de teléfono',
    }),
    IsString({ message: 'El teléfono debe ser un texto.' }),
    required
      ? IsNotEmpty({ message: 'El teléfono es obligatorio.' })
      : IsOptional(),
    Matches(/^[0-9]{7,15}$/, {
      message:
        'El teléfono debe contener solo números y tener entre 7 y 15 dígitos.',
    }),
  );
}

export function IsValidDate(required: boolean = true) {
  return applyDecorators(
    ApiProperty({
      example: '2023-10-15T14:30:00.000Z',
      description: 'Fecha en formato ISO 8601',
    }),
    required
      ? IsNotEmpty({ message: 'La fecha es obligatoria.' })
      : IsOptional(),
    IsString({ message: 'La fecha debe ser un texto en formato ISO 8601.' }),
    Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/, {
      message: 'La fecha debe tener el formato ISO 8601.',
    }),
  );
}

export function IsValidEnum(
  name: string,
  enumType: Record<string, string | number>,
  required: boolean = true,
) {
  const values = Object.values(enumType).filter(
    (v) => typeof v === 'string' || typeof v === 'number',
  );

  return applyDecorators(
    ApiProperty({
      example: values[0],
      description: `Valor del enum ${name}. Valores permitidos: ${values.join(
        ', ',
      )}`,
      enum: values,
    }),
    required
      ? IsNotEmpty({ message: `El enum ${name} es obligatorio.` })
      : IsOptional(),
    IsEnum(enumType, {
      message: `El enum ${name} debe ser uno de los valores permitidos.`,
    }),
  );
}
