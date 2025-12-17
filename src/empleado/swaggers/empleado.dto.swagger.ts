import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { AreaDto } from '../../area/dtos/area.dto';

// -----------------------------
// ID del empleado
// -----------------------------
export function EmpleadoIdField() {
  return applyDecorators(
    ApiProperty({
      example: 'd92a44c1-58f4-4ae5-bc67-2fa10c5e1e3f',
      description: 'Identificador único del empleado',
    }),
    IsString({ message: 'El ID debe ser un texto.' }),
    IsNotEmpty({ message: 'El ID es obligatorio.' }),
  );
}

// -----------------------------
// Email del empleado
// -----------------------------
export function EmpleadoEmailField() {
  return applyDecorators(
    ApiProperty({
      example: 'empleado@example.com',
      description: 'Correo del empleado',
    }),
    IsEmail({}, { message: 'El correo no es válido.' }),
    IsNotEmpty({ message: 'El correo es obligatorio.' }),
  );
}

// -----------------------------
// Teléfono del empleado
// -----------------------------
export function EmpleadoTelefonoField() {
  return applyDecorators(
    ApiProperty({
      example: '1122334455',
      description: 'Número de teléfono del empleado',
    }),
    IsString({ message: 'El teléfono debe ser un texto.' }),
    IsNotEmpty({ message: 'El teléfono es obligatorio.' }),
  );
}

// -----------------------------
// Nombre del empleado
// -----------------------------
export function EmpleadoNombreField() {
  return applyDecorators(
    ApiProperty({
      example: 'Juan Pérez',
      description: 'Nombre del empleado',
    }),
    IsString({ message: 'El nombre debe ser un texto.' }),
    IsNotEmpty({ message: 'El nombre es obligatorio.' }),
  );
}

// -----------------------------
// Área del empleado
// -----------------------------
export function EmpleadoAreaField() {
  return applyDecorators(
    ApiProperty({
      description: 'Área asignada al empleado',
      type: AreaDto,
      nullable: true,
    }),
    IsOptional(),
  );
}

// -----------------------------
// Asignar área del empleado
// -----------------------------
export function EmpleadoAsignarAreaField() {
  return applyDecorators(
    ApiProperty({
      example: 'Ventas',
      description: 'Área de trabajo del empleado.',
    }),
    IsString({ message: 'El área debe ser un texto.' }),
    IsNotEmpty({ message: 'El área es obligatoria.' }),
  );
}
