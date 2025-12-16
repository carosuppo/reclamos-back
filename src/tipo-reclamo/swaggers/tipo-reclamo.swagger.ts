import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TipoReclamoDto } from '../dtos/tipo-reclamo.dto';

// ===========================
//     FIND ALL
// ===========================
export function SwaggerFindAllTipoReclamo() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener todos los tipos de reclamo',
      description: 'Devuelve el listado completo de tipos de reclamo.',
    }),
    ApiResponse({
      status: 200,
      description: 'Listado de tipos de reclamo obtenido correctamente.',
      type: TipoReclamoDto,
      isArray: true,
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al obtener los tipos de reclamo.',
    }),
  );
}

// ===========================
//     FIND ONE
// ===========================
export function SwaggerFindOneTipoReclamo() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtener un tipo de reclamo por ID',
      description:
        'Busca y devuelve un tipo de reclamo utilizando el ID proporcionado.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del tipo de reclamo.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'Tipo de reclamo encontrado.',
      type: TipoReclamoDto,
    }),
    ApiResponse({
      status: 404,
      description: 'No existe un tipo de reclamo con ese ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al buscar el tipo de reclamo.',
    }),
  );
}
