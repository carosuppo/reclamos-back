import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ClienteService } from '../cliente/cliente.service';
import { EmpleadoService } from '../empleado/empleado.service';
import { AuthValidator } from './validators/auth.validator';
import { AuthHelper } from './helpers/auth.helper';
import { Role } from '../common/enums/role.enum';

describe('AuthService', () => {
  let service: AuthService;

  const mockClienteService = {
    findForAuth: jest.fn(),
  };

  const mockEmpleadoService = {
    findForAuth: jest.fn(),
  };

  const mockValidator = {
    validateEmail: jest.fn(),
  };

  const mockHelper = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ClienteService, useValue: mockClienteService },
        { provide: EmpleadoService, useValue: mockEmpleadoService },
        { provide: AuthValidator, useValue: mockValidator },
        { provide: AuthHelper, useValue: mockHelper },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('register debe validar email y delegar en helper', async () => {
    const dto = {
      email: 'test@mail.com',
      contraseña: '12345',
      nombre: 'Juan',
      telefono: '123456789',
    };

    mockValidator.validateEmail.mockResolvedValue(true);
    mockHelper.register.mockResolvedValue({ access_token: 'token123' });

    const result = await service.register(dto as never, Role.CLIENTE);

    expect(mockValidator.validateEmail).toHaveBeenCalledWith(dto.email);
    expect(mockHelper.register).toHaveBeenCalledWith(dto, Role.CLIENTE);
    expect(result).toEqual({ access_token: 'token123' });
  });

  it('login debe loguear cliente y devolver token', async () => {
    mockClienteService.findForAuth.mockResolvedValue({
      id: 'C1',
      contraseña: 'hashedpass',
    });

    mockHelper.login.mockResolvedValue({ access_token: 'tokC1' });

    const result = await service.login({
      email: 'cliente@mail.com',
      contraseña: '123',
    } as never);

    expect(mockClienteService.findForAuth).toHaveBeenCalledWith(
      'cliente@mail.com',
    );
    expect(mockHelper.login).toHaveBeenCalledWith(
      'C1',
      '123',
      'hashedpass',
      Role.CLIENTE,
    );
    expect(result).toEqual({ access_token: 'tokC1' });
  });

  it('login debe loguear empleado y devolver token', async () => {
    mockClienteService.findForAuth.mockResolvedValue(null);
    mockEmpleadoService.findForAuth.mockResolvedValue({
      id: 'E1',
      contraseña: 'hpass',
    });

    mockHelper.login.mockResolvedValue({ access_token: 'tokE1' });

    const result = await service.login({
      email: 'empleado@mail.com',
      contraseña: '123',
    } as never);

    expect(mockEmpleadoService.findForAuth).toHaveBeenCalledWith(
      'empleado@mail.com',
    );
    expect(mockHelper.login).toHaveBeenCalledWith(
      'E1',
      '123',
      'hpass',
      Role.EMPLEADO,
    );
    expect(result).toEqual({ access_token: 'tokE1' });
  });

  it('login debe fallar si las credenciales son invalidas', async () => {
    mockClienteService.findForAuth.mockResolvedValue(null);
    mockEmpleadoService.findForAuth.mockResolvedValue(null);

    await expect(
      service.login({ email: 'x@mail.com', contraseña: '123' } as never),
    ).rejects.toThrow(UnauthorizedException);
  });
});
