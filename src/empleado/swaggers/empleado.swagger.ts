import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateEmpleadoDto } from '../dtos/update.empleado.dto';
import { EmpleadoDto } from '../dtos/empleado.dto';
import { AsignarAreaDto } from '../dtos/asignar.area.dto';

// ===========================
//     UPDATE PROFILE
// ===========================
export function SwaggerUpdateEmpleadoProfile() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Actualizar perfil del empleado',
      description:
        'Permite al empleado autenticado actualizar sus datos de perfil.',
    }),
    ApiBody({
      type: UpdateEmpleadoDto,
      description: 'Datos a actualizar del perfil del empleado.',
    }),
    ApiResponse({
      status: 200,
      description: 'Perfil actualizado correctamente.',
      type: EmpleadoDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos o email ya en uso.',
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado.',
    }),
    ApiResponse({
      status: 403,
      description: 'No permitido para este rol.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al actualizar el perfil.',
    }),
  );
}

// ===========================
//     ASIGNAR AREA
// ===========================
export function SwaggerAsignarAreaEmpleado() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Asignar área a un empleado',
      description:
        'Asigna un área existente a un empleado identificado por su email.',
    }),
    ApiParam({
      name: 'email',
      description: 'Email del empleado.',
      example: 'empleado@empresa.com',
    }),
    ApiBody({
      type: AsignarAreaDto,
      description: 'Área a asignar al empleado.',
    }),
    ApiResponse({
      status: 200,
      description: 'Área asignada correctamente al empleado.',
      type: EmpleadoDto,
    }),
    ApiResponse({
      status: 400,
      description: 'El área no existe o datos inválidos.',
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado.',
    }),
    ApiResponse({
      status: 403,
      description: 'No permitido para este rol.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al asignar el área.',
    }),
  );
}
