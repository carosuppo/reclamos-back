import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateAreaDto } from '../dtos/create-area.dto';
import { UpdateAreaDto } from '../dtos/update-area.dto';
import { AreaDto } from '../dtos/area.dto';

// ===========================
//     CREATE
// ===========================
export function SwaggerCreateArea() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crea una nueva área.',
      description:
        'Crea una nueva área en la base de datos y devuelve el área creada.',
    }),
    ApiBody({
      type: CreateAreaDto,
      description: 'Datos necesarios para crear el área.',
    }),
    ApiResponse({
      status: 201,
      description: 'Área creada correctamente.',
      type: AreaDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos proporcionados.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al crear el área.',
    }),
  );
}

// ===========================
//     FIND ALL
// ===========================
export function SwaggerFindAllArea() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene todas las áreas.',
      description: 'Devuelve un listado de todas las áreas registradas.',
    }),
    ApiResponse({
      status: 200,
      description: 'Listado de áreas obtenido correctamente.',
      type: AreaDto,
      isArray: true,
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor al obtener las áreas.',
    }),
  );
}

// ===========================
//     FIND ONE
// ===========================
export function SwaggerFindOneArea() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene un área por su ID.',
      description:
        'Busca un área en la base de datos utilizando el ID proporcionado.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del área a buscar.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'Área encontrada y devuelta correctamente.',
      type: AreaDto,
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontró un área con el ID proporcionado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al buscar el área.',
    }),
  );
}

// ===========================
//     UPDATE
// ===========================
export function SwaggerUpdateArea() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualiza un área.',
      description: 'Modifica los datos de un área existente utilizando su ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del área a actualizar.',
      example: '68f0602ae29a2c2e0ff28628',
    }),
    ApiBody({
      type: UpdateAreaDto,
      description: 'Datos a actualizar en el área.',
    }),
    ApiResponse({
      status: 200,
      description: 'Área actualizada correctamente.',
      type: AreaDto,
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos proporcionados.',
    }),
    ApiResponse({
      status: 404,
      description: 'No existe un área con ese ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al actualizar el área.',
    }),
  );
}

// ===========================
//     DELETE (SOFT DELETE)
// ===========================
export function SwaggerDeleteArea() {
  return applyDecorators(
    ApiOperation({
      summary: 'Elimina un área.',
      description:
        'Realiza un borrado lógico (soft delete) de un área mediante su ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del área a eliminar.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'Área eliminada correctamente.',
    }),
    ApiResponse({
      status: 404,
      description: 'No existe un área con ese ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al eliminar el área.',
    }),
  );
}
