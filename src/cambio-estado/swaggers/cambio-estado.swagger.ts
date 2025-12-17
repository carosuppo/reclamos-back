import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CambioEstadoDto } from '../dtos/cambio-estado.dto';

// ===========================
//     FIND BY RECLAMO
// ===========================
export function SwaggerFindCambioEstadoByReclamo() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene los cambios de estado de un reclamo.',
      description:
        'Devuelve el historial de cambios de estado asociados a un reclamo específico.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del reclamo.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description:
        'Listado de cambios de estado del reclamo obtenido correctamente.',
      type: CambioEstadoDto,
      isArray: true,
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontraron cambios de estado para el reclamo.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al obtener los cambios de estado.',
    }),
  );
}

// ===========================
//     FIND BY ESTADO
// ===========================
export function SwaggerFindCambioEstadoByEstado() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene los cambios de estado por estado.',
      description:
        'Devuelve todos los cambios de estado filtrados por el estado proporcionado.',
    }),
    ApiParam({
      name: 'estado',
      description:
        'Estado del reclamo (por ejemplo: INICIAL, EN_PROCESO, TERMINADO).',
      example: 'EN_PROCESO',
    }),
    ApiResponse({
      status: 200,
      description:
        'Listado de cambios de estado filtrados por estado obtenido correctamente.',
      type: CambioEstadoDto,
      isArray: true,
    }),
    ApiResponse({
      status: 400,
      description: 'Estado inválido proporcionado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al obtener los cambios de estado.',
    }),
  );
}
