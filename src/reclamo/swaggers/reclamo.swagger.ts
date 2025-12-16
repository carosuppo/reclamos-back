import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateReclamoDto } from '../dtos/create-reclamo.dto';
import { UpdateEstadoDto } from '../dtos/update-estado.dto';
import { ReasignarAreaDto } from '../dtos/reasignar-area.dto';
import { UpdateReclamoDto } from '../dtos/update-reclamo.dto';
import { ReclamoDto } from '../dtos/reclamo.dto';

// ===========================
//     CREATE
// ===========================
export function SwaggerCreateReclamo() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Crear un reclamo',
      description:
        'Permite a un cliente autenticado crear un nuevo reclamo asociado a un proyecto.',
    }),
    ApiBody({
      type: CreateReclamoDto,
      description: 'Datos necesarios para crear el reclamo.',
    }),
    ApiResponse({
      status: 201,
      description: 'Reclamo creado correctamente.',
      type: ReclamoDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos o entidades inexistentes.',
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado.',
    }),
    ApiResponse({
      status: 403,
      description: 'No permitido para este rol.',
    }),
  );
}

// ===========================
//     FIND BY CLIENTE
// ===========================
export function SwaggerFindReclamosByCliente() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obtener reclamos del cliente',
      description:
        'Devuelve todos los reclamos asociados al cliente autenticado.',
    }),
    ApiResponse({
      status: 200,
      description: 'Listado de reclamos del cliente.',
      type: ReclamoDto,
      isArray: true,
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado.',
    }),
    ApiResponse({
      status: 403,
      description: 'No permitido para este rol.',
    }),
  );
}

// ===========================
//     UPDATE ESTADO
// ===========================
export function SwaggerUpdateEstadoReclamo() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Actualizar estado de un reclamo',
      description:
        'Permite a un empleado actualizar el estado de un reclamo según las transiciones permitidas.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del reclamo.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiBody({
      type: UpdateEstadoDto,
      description: 'Nuevo estado del reclamo.',
    }),
    ApiResponse({
      status: 200,
      description: 'Estado del reclamo actualizado correctamente.',
      type: ReclamoDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Cambio de estado inválido.',
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
      status: 404,
      description: 'Reclamo inexistente.',
    }),
  );
}

// ===========================
//     REASSIGN AREA
// ===========================
export function SwaggerReassignAreaReclamo() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Reasignar área de un reclamo',
      description:
        'Permite a un empleado reasignar el área responsable de un reclamo.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del reclamo.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiBody({
      type: ReasignarAreaDto,
      description: 'Nueva área a asignar.',
    }),
    ApiResponse({
      status: 200,
      description: 'Área reasignada correctamente.',
      type: ReclamoDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Área inválida o reclamo resuelto.',
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
      status: 404,
      description: 'Reclamo inexistente.',
    }),
  );
}

// ===========================
//     UPDATE RECLAMO (CLIENTE)
// ===========================
export function SwaggerUpdateReclamo() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Actualizar reclamo',
      description:
        'Permite al cliente actualizar los datos de un reclamo existente.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del reclamo.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiBody({
      type: UpdateReclamoDto,
      description: 'Datos a actualizar del reclamo.',
    }),
    ApiResponse({
      status: 200,
      description: 'Reclamo actualizado correctamente.',
      type: ReclamoDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos.',
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
      status: 404,
      description: 'Reclamo inexistente.',
    }),
  );
}

// ===========================
//     FIND BY AREA (EMPLEADO)
// ===========================
export function SwaggerFindReclamosByArea() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obtener reclamos por área',
      description:
        'Devuelve los reclamos asociados al área del empleado autenticado.',
    }),
    ApiResponse({
      status: 200,
      description: 'Listado de reclamos del área.',
      type: ReclamoDto,
      isArray: true,
    }),
    ApiResponse({
      status: 400,
      description: 'El empleado no tiene un área asignada.',
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado.',
    }),
    ApiResponse({
      status: 403,
      description: 'No permitido para este rol.',
    }),
  );
}

// ===========================
//     FIND BY FILTROS
// ===========================
export function SwaggerFindReclamosByFiltros() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Obtener cantidad de reclamos por filtros',
      description:
        'Devuelve la cantidad de reclamos que cumplen con los filtros proporcionados.',
    }),
    ApiQuery({
      name: 'estado',
      required: false,
      description: 'Estado del reclamo.',
    }),
    ApiQuery({
      name: 'clienteId',
      required: false,
      description: 'ID del cliente.',
    }),
    ApiQuery({
      name: 'fechaDesde',
      required: false,
      description: 'Fecha desde (YYYY-MM-DD).',
    }),
    ApiQuery({
      name: 'fechaHasta',
      required: false,
      description: 'Fecha hasta (YYYY-MM-DD).',
    }),
    ApiResponse({
      status: 200,
      description: 'Cantidad de reclamos encontrados.',
      schema: { example: 12 },
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado.',
    }),
    ApiResponse({
      status: 403,
      description: 'No permitido para este rol.',
    }),
  );
}

// ===========================
//     METRICAS
// ===========================
export function SwaggerTiempoPromedioResolucion() {
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

export function SwaggerCantidadPromedioResolucion() {
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
