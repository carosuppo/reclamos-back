import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

// ===========================
//     FIND ALL
// ===========================
export function SwaggerFindAllTipoProyecto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene todos los tipos de proyecto.',
      description:
        'Devuelve un listado completo de todos los tipos de proyecto registrados en la base de datos.',
    }),
    ApiResponse({
      status: 200,
      description: 'Listado obtenido correctamente.',
    }),
    ApiResponse({
      status: 500,
      description:
        'Error interno del servidor al obtener la lista de tipos de proyecto.',
    }),
  );
}

// ===========================
//     FIND ONE
// ===========================
export function SwaggerFindOneTipoProyecto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene un tipo de proyecto por su ID.',
      description:
        'Busca y devuelve un tipo de proyecto utilizando el ID proporcionado. Si no existe, retorna un error.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del tipo de proyecto (ObjectId de MongoDB).',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'Tipo de proyecto encontrado correctamente.',
    }),
    ApiResponse({
      status: 404,
      description: 'No existe un tipo de proyecto con ese ID.',
    }),
    ApiResponse({
      status: 400,
      description: 'El ID proporcionado no es válido.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al buscar el tipo de proyecto.',
    }),
  );
}
