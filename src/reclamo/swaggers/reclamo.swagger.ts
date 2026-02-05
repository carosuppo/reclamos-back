import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

// ===========================
//     METRICAS
// ===========================
export function SwaggerTiemProm() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Tiempo promedio de resolución',
      description:
        'Devuelve el tiempo promedio de resolución (en días) de los reclamos por área.',
    }),
    ApiQuery({
      name: 'areaId',
      description: 'ID del área.',
    }),
    ApiResponse({
      status: 200,
      description: 'Tiempo promedio de resolución.',
      schema: { example: 3.45 },
    }),
    ApiResponse({
      status: 400,
      description: 'Área inválida.',
    }),
  );
}

export function SwaggerCantProm() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Cantidad promedio de resolución',
      description:
        'Devuelve el porcentaje promedio de reclamos resueltos por área.',
    }),
    ApiQuery({
      name: 'areaId',
      description: 'ID del área.',
    }),
    ApiResponse({
      status: 200,
      description: 'Cantidad promedio de resolución.',
      schema: { example: 0.75 },
    }),
    ApiResponse({
      status: 400,
      description: 'Área inválida.',
    }),
  );
}
