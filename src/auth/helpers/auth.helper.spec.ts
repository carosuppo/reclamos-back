import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ClienteService } from '../../cliente/cliente.service';
import { EmpleadoService } from '../../empleado/empleado.service';
import { Role } from '../../common/enums/role.enum';
import { AuthHelper } from './auth.helper';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthHelper', () => {
  const mockJwtService = {
    signAsync: jest.fn(),
  };

  const mockEmpleadoService = {
    create: jest.fn(),
  };

  const mockClienteService = {
    create: jest.fn(),
  };

  let helper: AuthHelper;

  beforeEach(() => {
    helper = new AuthHelper(
      mockJwtService as unknown as JwtService,
      mockEmpleadoService as unknown as EmpleadoService,
      mockClienteService as unknown as ClienteService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('register registra empleado cuando rol es EMPLEADO', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    mockEmpleadoService.create.mockResolvedValue({ id: 'emp-1' });
    mockJwtService.signAsync.mockResolvedValue('token');

    const result = await helper.register(
      {
        email: 'e@test.com',
        contraseña: '123456',
        nombre: 'Emp',
        telefono: '123',
      } as never,
      Role.EMPLEADO,
    );

    expect(mockEmpleadoService.create).toHaveBeenCalled();
    expect(result).toEqual({ access_token: 'token' });
  });

  it('register registra cliente cuando rol es CLIENTE', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    mockClienteService.create.mockResolvedValue({ id: 'cli-1' });
    mockJwtService.signAsync.mockResolvedValue('token');

    const result = await helper.register(
      {
        email: 'c@test.com',
        contraseña: '123456',
        nombre: 'Cli',
        telefono: '123',
      } as never,
      Role.CLIENTE,
    );

    expect(mockClienteService.create).toHaveBeenCalled();
    expect(result).toEqual({ access_token: 'token' });
  });

  it('login valida contrase�a y devuelve token', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.signAsync.mockResolvedValue('token');

    const result = await helper.login('id-1', 'plana', 'hash', Role.CLIENTE);

    expect(result).toEqual({ access_token: 'token' });
  });

  it('validarContrase�a lanza UnauthorizedException si no coincide', async () => {
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(helper.validarContraseña('hash', 'plana')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('transformarContrase�a hashea la contrase�a', async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
    const dto = { contraseña: '123456' } as never;

    await helper.transformarContraseña(dto);

    expect(dto.contraseña).toBe('hashed');
  });

  it('firmarToken genera token', async () => {
    mockJwtService.signAsync.mockResolvedValue('jwt');

    const result = await helper.firmarToken('id-1', Role.CLIENTE);

    expect(result).toEqual({ access_token: 'jwt' });
  });
});
