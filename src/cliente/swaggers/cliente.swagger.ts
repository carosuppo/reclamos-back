import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UpdateClienteDto } from '../dtos/update.cliente.dto';

export function SwaggerUpdateCliente() {
  return applyDecorators(
    ApiOperation({
      summary: 'Actualizar los datos del cliente autenticado.',
      description:
        'Permite que el cliente autenticado actualice su información personal. ' +
        'El token JWT es obligatorio para acceder a este endpoint.',
    }),

    ApiBearerAuth(),

    ApiBody({
      type: UpdateClienteDto,
      description: 'Campos opcionales para actualizar del cliente.',
      examples: {
        actualizarEmail: {
          summary: 'Actualizar solo el email',
          value: {
            email: 'nuevo-correo@example.com',
          },
        },
        actualizarTelefono: {
          summary: 'Actualizar solo el teléfono',
          value: {
            telefono: '3516789900',
          },
        },
        actualizarTodo: {
          summary: 'Actualizar todos los campos',
          value: {
            email: 'cliente-editado@example.com',
            nombre: 'Thomas Moreno Editado',
            telefono: '3515557777',
          },
        },
      },
    }),

    ApiResponse({
      status: 200,
      description: 'Datos del cliente actualizados correctamente.',
      schema: {
        example: {
          id: '6918e2ebf030ce5632e8cac4',
          email: 'cliente-editado@example.com',
          nombre: 'Thomas Moreno Editado',
          telefono: '3515557777',
        },
      },
    }),

    ApiResponse({
      status: 400,
      description: 'Datos inválidos enviados al servidor.',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        },
      },
    }),

    ApiResponse({
      status: 401,
      description: 'Token inválido o no proporcionado.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
        },
      },
    }),

    ApiResponse({
      status: 500,
      description: 'Error interno del servidor al actualizar los datos.',
    }),
  );
}
