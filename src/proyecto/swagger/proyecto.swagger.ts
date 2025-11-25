import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateProyectoDto } from '../dto/create-proyecto.dto';
import { UpdateProyectoDto } from '../dto/update-proyecto.dto';

// ===========================
//     CREATE
// ===========================
export function SwaggerCreateProyecto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crea un nuevo proyecto.',
      description:
        'Crea un nuevo proyecto en la base de datos utilizando Prisma. Devuelve el proyecto creado.',
    }),
    ApiBody({
      type: CreateProyectoDto,
      description: 'Datos necesarios para crear el proyecto.',
    }),
    ApiResponse({
      status: 201,
      description: 'Proyecto creado correctamente.',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos proporcionados.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al crear el proyecto.',
    }),
  );
}

// ===========================
//     FIND ALL
// ===========================
export function SwaggerFindAllProyecto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene todos los proyectos.',
      description: 'Devuelve un listado de todos los proyectos registrados.',
    }),
    ApiResponse({
      status: 200,
      description: 'Listado de proyectos obtenido correctamente.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno del servidor al obtener los proyectos.',
    }),
  );
}

// ===========================
//     FIND ONE
// ===========================
export function SwaggerFindOneProyecto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene un proyecto por su ID.',
      description:
        'Busca un proyecto en la base de datos utilizando el ID proporcionado.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del proyecto a buscar.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'Proyecto encontrado y devuelto correctamente.',
    }),
    ApiResponse({
      status: 404,
      description: 'No se encontró un proyecto con el ID proporcionado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al buscar el proyecto.',
    }),
  );
}

// ===========================
//     FIND BY TIPO PROYECTO
// ===========================
export function SwaggerFindByTipoProyecto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Obtiene proyectos por tipo de proyecto.',
      description:
        'Busca proyectos en la base de datos utilizando el ID del tipo de proyecto proporcionado.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del tipo de proyecto a buscar.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'Proyectos encontrados y devueltos correctamente.',
    }),
    ApiResponse({
      status: 404,
      description:
        'No se encontraron proyectos con el ID del tipo de proyecto proporcionado.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al buscar los proyectos.',
    }),
  );
}

// ===========================
//     UPDATE
// ===========================
export function SwaggerUpdateProyecto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualiza un proyecto.',
      description:
        'Modifica los datos de un proyecto existente utilizando su ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del proyecto a actualizar.',
      example: '68f0602ae29a2c2e0ff28628',
    }),
    ApiBody({
      type: UpdateProyectoDto,
      description: 'Datos a actualizar en el proyecto.',
    }),
    ApiResponse({
      status: 200,
      description: 'Proyecto actualizado correctamente.',
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos proporcionados.',
    }),
    ApiResponse({
      status: 404,
      description: 'No existe un proyecto con ese ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al actualizar el proyecto.',
    }),
  );
}

// ===========================
//     DELETE
// ===========================
export function SwaggerDeleteProyecto() {
  return applyDecorators(
    ApiOperation({
      summary: 'Elimina un proyecto.',
      description: 'Elimina un proyecto mediante su ID.',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del proyecto a eliminar.',
      example: '68f0602ae29a2c2e0ff28625',
    }),
    ApiResponse({
      status: 200,
      description: 'Proyecto eliminado correctamente (retorna true).',
    }),
    ApiResponse({
      status: 404,
      description: 'No existe un proyecto con ese ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error interno al eliminar el proyecto.',
    }),
  );
}
