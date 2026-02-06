import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDTO } from './dtos/register.dto';
import { LoginDTO } from './dtos/login.dto';
import { Role } from '../common/enums/role.enum';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
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
      const registerDto: RegisterDTO = {
        email: 'cliente@test.com',
        contraseña: '123456',
        nombre: 'Juan Perez',
        telefono: '111222333',
      };

      const expectedResult = { access_token: 'jwt-cliente-123' };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.registerCliente(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        registerDto,
        Role.CLIENTE,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('POST /auth/register-empleado', () => {
    it('debe registrar un empleado y devolver access_token', async () => {
      const registerDto: RegisterDTO = {
        email: 'empleado@test.com',
        contraseña: 'abc123',
        nombre: 'Ana Gomez',
        telefono: '999888777',
      };

      const expectedResult = { access_token: 'jwt-empleado-456' };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.registerEmpleado(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(
        registerDto,
        Role.EMPLEADO,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('POST /auth/login', () => {
    it('debe iniciar sesion y devolver access_token', async () => {
      const loginDto: LoginDTO = {
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

  describe('Errores propagados desde el service', () => {
    it('debe propagar error en register-cliente si falla el service', async () => {
      const registerDto: RegisterDTO = {
        email: 'duplicado@test.com',
        contraseña: '123',
        nombre: 'Test',
        telefono: '123456',
      };

      mockAuthService.register.mockRejectedValue(new Error('El email ya esta en uso'));

      await expect(controller.registerCliente(registerDto)).rejects.toThrow();
    });
  });
});
