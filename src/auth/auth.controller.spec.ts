import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      registerCliente: jest.fn(),
      registerEmpleado: jest.fn(),
      login: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  describe('registrarCliente', () => {
    it('debería registrar un cliente y devolver access_token', async () => {
      const dto: RegisterDto = {
        email: 'test@example.com',
        contraseña: '123456',
        nombre: 'Juan',
        telefono: '123456789',
      };

      const result = { access_token: 'fake-token' };
      authService.registerCliente.mockResolvedValue(result);

      const response = await controller.registrarCliente(dto);

      expect(authService.registerCliente).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('registrarEmpleado', () => {
    it('debería registrar un empleado y devolver access_token', async () => {
      const dto: RegisterDto = {
        email: 'empleado@example.com',
        contraseña: 'abcdef',
        nombre: 'Carlos',
        telefono: '987654321',
      };

      const result = { access_token: 'token-empleado' };
      authService.registerEmpleado.mockResolvedValue(result);

      const response = await controller.registrarEmpleado(dto);

      expect(authService.registerEmpleado).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });

  describe('login', () => {
    it('debería iniciar sesión correctamente', async () => {
      const dto: LoginDto = {
        email: 'usuario@example.com',
        contraseña: 'password',
      };

      const result = { access_token: 'login-token' };
      authService.login.mockResolvedValue(result);

      const response = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(response).toEqual(result);
    });
  });
});

