import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiUnauthorizedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';

export function SwaggerRegisterCliente() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar un nuevo cliente',
      description:
        'Crea un cliente en el sistema usando los datos enviados en el cuerpo de la solicitud. ' +
        'Devuelve un JWT (access_token) si el registro es exitoso. ' +
        'El email debe ser único en el sistema.',
    }),

    ApiExtraModels(RegisterDto),

    ApiBody({
      description: 'Datos requeridos para registrar un cliente',
      type: RegisterDto,
      examples: {
        ejemploCorrecto: {
          summary: 'Cliente válido',
          value: {
            nombre: 'Juan Perez',
            email: 'juan@example.com',
            telefono: '3516789900',
            contraseña: 'MiClaveSegura123',
          },
        },
        emailDuplicado: {
          summary: 'Intento de registro con email ya existente',
          value: {
            nombre: 'Carlos López',
            email: 'registrado@example.com',
            telefono: '3511112233',
            contraseña: 'Clave12345',
          },
        },
      },
    }),

    ApiCreatedResponse({
      description: 'Cliente registrado correctamente',
      schema: {
        example: {
          access_token: 'jwt_generado_aqui...',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Error de validación o email ya en uso.',
      schema: {
        example: {
          statusCode: 400,
          message: 'El email ya está en uso',
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function SwaggerRegisterEmpleado() {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar un nuevo empleado',
      description:
        'Crea un empleado en el sistema y retorna un JWT para autenticación. ' +
        'El email debe ser único.',
    }),

    ApiExtraModels(RegisterDto),

    ApiBody({
      description: 'Datos necesarios para registrar un empleado',
      type: RegisterDto,
      examples: {
        ejemploCorrecto: {
          summary: 'Empleado válido',
          value: {
            nombre: 'María González',
            email: 'maria@example.com',
            telefono: '3515559900',
            contraseña: 'PasswordSeguro456',
          },
        },
      },
    }),

    ApiCreatedResponse({
      description: 'Empleado registrado correctamente',
      schema: {
        example: {
          access_token: 'jwt_generado_aqui...',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Error en los datos enviados o email duplicado.',
      schema: {
        example: {
          statusCode: 400,
          message: 'El email ya está en uso',
          error: 'Bad Request',
        },
      },
    }),
  );
}

export function SwaggerLogin() {
  return applyDecorators(
    ApiOperation({
      summary: 'Iniciar sesión',
      description:
        'Valida las credenciales enviadas y retorna un JWT válido. ' +
        'Aplica tanto para clientes como empleados.',
    }),

    ApiExtraModels(LoginDto),

    ApiBody({
      description: 'Credenciales del usuario',
      type: LoginDto,
      examples: {
        ejemploCorrecto: {
          summary: 'Login exitoso',
          value: {
            email: 'usuario@example.com',
            contraseña: 'MiPassword123',
          },
        },
        ejemploIncorrecto: {
          summary: 'Credenciales inválidas',
          value: {
            email: 'usuario@example.com',
            contraseña: 'incorrecta',
          },
        },
      },
    }),

    ApiOkResponse({
      description: 'Login exitoso',
      schema: {
        example: {
          access_token: 'jwt_generado_aqui...',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Credenciales incorrectas',
      schema: {
        example: {
          statusCode: 401,
          message: 'Credenciales inválidas',
          error: 'Unauthorized',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Datos enviados incompletos o mal formateados.',
      schema: {
        example: {
          statusCode: 400,
          message: 'email must be an email',
          error: 'Bad Request',
        },
      },
    }),
  );
}
