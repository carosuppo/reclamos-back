import { ClienteMapper } from './cliente.mapper';
import { Role } from '../../common/enums/role.enum';

const clienteEntity = {
  id: 'cli-1',
  email: 'c@test.com',
  contraseña: 'hash',
  nombre: 'Cliente',
  telefono: '123',
  role: Role.CLIENTE,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('ClienteMapper', () => {
  it('toClienteDTO mapea entidad', () => {
    const dto = ClienteMapper.toClienteDTO(clienteEntity as never);

    expect(dto).toEqual({
      id: 'cli-1',
      email: 'c@test.com',
      telefono: '123',
      nombre: 'Cliente',
    });
  });

  it('toClienteCreateData agrega role CLIENTE', () => {
    const data = ClienteMapper.toClienteCreateData({
      email: 'c@test.com',
      contraseña: '123',
      nombre: 'Cliente',
      telefono: '123',
    } as never);

    expect(data).toEqual({
      email: 'c@test.com',
      contraseña: '123',
      nombre: 'Cliente',
      telefono: '123',
      role: Role.CLIENTE,
    });
  });

  it('toClienteUpdateData agrega id', () => {
    const data = ClienteMapper.toClienteUpdateData('cli-1', {
      email: 'n@test.com',
    });

    expect(data).toEqual({
      id: 'cli-1',
      email: 'n@test.com',
      nombre: undefined,
      telefono: undefined,
    });
  });

  it('toAuthClienteDTO mapea auth', () => {
    const dto = ClienteMapper.toAuthClienteDTO(clienteEntity as never);

    expect(dto).toEqual({
      id: 'cli-1',
      email: 'c@test.com',
      contraseña: 'hash',
      role: Role.CLIENTE,
    });
  });
});

