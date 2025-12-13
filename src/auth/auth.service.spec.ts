import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ClienteService } from 'src/cliente/cliente.service';
import { EmpleadoService } from 'src/empleado/empleado.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mocks
const mockClienteService = {
  register: jest.fn(),
  findOne: jest.fn(),
  findForAuth: jest.fn(),
};

const mockEmpleadoService = {
  register: jest.fn(),
  findOne: jest.fn(),
  findForAuth: jest.fn(),
};

const mockJwtService = {
  signAsync: jest.fn(),
};

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ClienteService, useValue: mockClienteService },
        { provide: EmpleadoService, useValue: mockEmpleadoService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('registerCliente debe registrar cliente y devolver token', async () => {
    mockClienteService.findOne.mockResolvedValue(null);
    mockEmpleadoService.findOne.mockResolvedValue(null);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed123');
    mockClienteService.register.mockResolvedValue({ id: 'ABC123' });
    mockJwtService.signAsync.mockResolvedValue('token123');

    const dto = {
      email: 'test@mail.com',
      contraseña: '12345',
      nombre: 'Juan',
      telefono: '123456789',
    };
    const result = await service.registerCliente(dto);

    expect(result).toEqual({ access_token: 'token123' });
    expect(mockClienteService.register).toHaveBeenCalled();
  });

  it('registerEmpleado debe registrar empleado y devolver token', async () => {
    mockClienteService.findOne.mockResolvedValue(null);
    mockEmpleadoService.findOne.mockResolvedValue(null);

    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed456');
    mockEmpleadoService.register.mockResolvedValue({ id: 'EMP999' });
    mockJwtService.signAsync.mockResolvedValue('tokenEMP');

    const dto = {
      email: 'empleado@mail.com',
      contraseña: 'abc',
      nombre: 'Juan',
      telefono: '123456789',
    };
    const result = await service.registerEmpleado(dto);

    expect(result).toEqual({ access_token: 'tokenEMP' });
    expect(mockEmpleadoService.register).toHaveBeenCalled();
  });

  it('validarEmailDisponible debe lanzar error si el email existe', async () => {
    mockClienteService.findOne.mockResolvedValue({ id: 'X' });
    mockEmpleadoService.findOne.mockResolvedValue(null);

    await expect(service.validarEmailDisponible('x@mail.com')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('login debe loguear cliente y devolver token', async () => {
    mockClienteService.findForAuth.mockResolvedValue({
      id: 'C1',
      role: 'CLIENTE',
      contraseña: 'hashedpass',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.signAsync.mockResolvedValue('tokC1');

    const result = await service.login({
      email: 'cliente@mail.com',
      contraseña: '123',
    });

    expect(result).toEqual({ access_token: 'tokC1' });
  });

  it('login debe loguear empleado y devolver token', async () => {
    mockClienteService.findForAuth.mockResolvedValue(null);

    mockEmpleadoService.findForAuth.mockResolvedValue({
      id: 'E1',
      role: 'EMPLEADO',
      contraseña: 'hpass',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.signAsync.mockResolvedValue('tokE1');

    const result = await service.login({
      email: 'empleado@mail.com',
      contraseña: '123',
    });

    expect(result).toEqual({ access_token: 'tokE1' });
  });

  it('login debe fallar si las credenciales son inválidas', async () => {
    mockClienteService.findForAuth.mockResolvedValue(null);
    mockEmpleadoService.findForAuth.mockResolvedValue(null);

    await expect(
      service.login({ email: 'x@mail.com', contraseña: '123' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('login debe fallar si la contraseña es incorrecta', async () => {
    mockClienteService.findForAuth.mockResolvedValue({
      id: 'C1',
      role: 'CLIENTE',
      contraseña: 'hashx',
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      service.login({ email: 'c@mail.com', contraseña: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('transformarContraseña debe hashear la contraseña', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed999');

    const dto = { contraseña: '111' };

    // @ts-expect-error acceso interno
    await service['transformarContraseña'](dto);

    expect(dto.contraseña).toBe('hashed999');
  });

  it('firmarToken debe generar un token JWT', async () => {
    mockJwtService.signAsync.mockResolvedValue('jwt123');

    const result = await service.firmarToken('ID77', 'CLIENTE');

    expect(result).toEqual({ access_token: 'jwt123' });
  });
});
