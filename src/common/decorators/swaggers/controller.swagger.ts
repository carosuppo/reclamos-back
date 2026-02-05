import { applyDecorators, Type } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

// ===========================
//     CREATE
// ===========================
export function SwaggerCreate<TBody, TResponse>(
  name: string,
  bodyDto: Type<TBody>,
  response: Type<TResponse>,
) {
  return applyDecorators(
    ApiOperation({
      summary: 'Crea una nueva entidad ' + name,
      description:
        'Crea una nueva entidad en la base de datos y devuelve la entidad creada.',
    }),
    ApiBody({
      type: bodyDto,
      description: 'Datos necesarios para crear.',
    }),
    ApiResponse({
      status: 201,
      description: name + 'creado/a correctamente.',
      type: response,
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos proporcionados.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al crear el/la ' + name,
    }),
  );
}

// ===========================
//     FIND ALL
// ===========================
export function SwaggerFindAll<TResponse>(
  name: string,
  response: Type<TResponse>,
) {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene todas las entidad de ' + name,
      description: 'Devuelve un listado de todas las entidades registradas.',
    }),
    ApiResponse({
      status: 200,
      description: 'Listado de ' + name + ' obtenido correctamente.',
      type: response,
      isArray: true,
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor.',
    }),
  );
}

// ===========================
//     FIND ONE
// ===========================
export function SwaggerFindById<TResponse>(
  name: string,
  response: Type<TResponse>,
) {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene un/a ' + name + ' por su ID.',
      description:
        'Busca un/a ' +
        name +
        ' en la base de datos utilizando el ID proporcionado.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del/a ' + name + ' a buscar.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'Entidad ' + name + ' encontrada y devuelta correctamente.',
      type: response,
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontró un/a ' + name + ' con el ID proporcionado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor.',
    }),
  );
}

// ===========================
//     UPDATE
// ===========================
export function SwaggerUpdate<TBody, TResponse>(
  name: string,
  bodyDto: Type<TBody>,
  response?: Type<TResponse>,
) {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualiza un/a ' + name,
      description:
        'Modifica los datos de un/a ' + name + ' existente utilizando su ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del/a ' + name + ' a actualizar.',
      example: '68f0602ae29a2c2e0ff28628',
    }),
    ApiBody({
      type: bodyDto,
      description: 'Datos a actualizar en el/a ' + name + '.',
    }),
    ApiResponse({
      status: 200,
      description: name + ' actualizado/a correctamente.',
      type: response || 'response not defined',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos proporcionados.',
    }),
    ApiResponse({
      status: 404,
      description: 'No existe una entidad con ese ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al actualizar.',
    }),
  );
}

// ===========================
//     DELETE (SOFT DELETE)
// ===========================
export function SwaggerDelete(name: string) {
  return applyDecorators(
    ApiOperation({
      summary: 'Elimina un/a ' + name,
      description:
        'Realiza un borrado lógico (soft delete) de un/a ' +
        name +
        ' mediante su ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del/a ' + name + ' a eliminar.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'true',
    }),
    ApiResponse({
      status: 404,
      description: 'No existe un/a ' + name + ' con ese ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al eliminar.',
    }),
  );
}
