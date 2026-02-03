import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { AsignarAreaDTO } from '../dtos/asignar-area.dto';
import { EmpleadoDTO } from '../dtos/empleado.dto';

// ===========================
//     ASIGNAR AREA
// ===========================
export function SwaggerAssignArea() {
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
      type: AsignarAreaDTO,
      description: 'Área a asignar al empleado.',
    }),
    ApiResponse({
      status: 200,
      description: 'Área asignada correctamente al empleado.',
      type: EmpleadoDTO,
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
