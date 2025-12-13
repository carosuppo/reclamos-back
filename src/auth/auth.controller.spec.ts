import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  // Mock del AuthService
  const mockAuthService = {
    registerCliente: jest.fn(),
    registerEmpleado: jest.fn(),
    login: jest.fn(),
    firmarToken: jest.fn(), // por si lo querés testear indirectamente
  };

  beforeEach(async () => {
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/register-cliente', () => {
    it('debe registrar un cliente y devolver access_token', async () => {
      const registerDto: RegisterDto = {
        email: 'cliente@test.com',
        contraseña: '123456',
        nombre: 'Juan Pérez',
        telefono: '111222333',
      };

      const expectedResult = { access_token: 'jwt-cliente-123' };

      mockAuthService.registerCliente.mockResolvedValue(expectedResult);

      const result = await controller.registrarCliente(registerDto);

      expect(mockAuthService.registerCliente).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('POST /auth/register-empleado', () => {
    it('debe registrar un empleado y devolver access_token', async () => {
      const registerDto: RegisterDto = {
        email: 'empleado@test.com',
        contraseña: 'abc123',
        nombre: 'Ana Gómez',
        telefono: '999888777',
      };

      const expectedResult = { access_token: 'jwt-empleado-456' };

      mockAuthService.registerEmpleado.mockResolvedValue(expectedResult);

      const result = await controller.registrarEmpleado(registerDto);

      expect(mockAuthService.registerEmpleado).toHaveBeenCalledWith(
        registerDto,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('POST /auth/login', () => {
    it('debe iniciar sesión y devolver access_token', async () => {
      const loginDto: LoginDto = {
        email: 'usuario@test.com',
        contraseña: '123456',
      };

      const expectedResult = { access_token: 'jwt-login-789' };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  // Opcional: casos de error (el controller solo pasa la excepción)
  describe('Errores propagados desde el service', () => {
    it('debe propagar BadRequestException en register-cliente si email duplicado', async () => {
      const registerDto: RegisterDto = {
        email: 'duplicado@test.com',
        contraseña: '123',
        nombre: 'Test',
        telefono: '123456',
      };

      mockAuthService.registerCliente.mockRejectedValue(
        new Error('El email ya está en uso'), // o BadRequestException si lo importás
      );

      await expect(controller.registrarCliente(registerDto)).rejects.toThrow();
    });
  });
});
