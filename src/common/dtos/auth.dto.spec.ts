import { AuthDTO } from './auth.dto';
import { Role } from '../enums/role.enum';

describe('AuthDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new AuthDTO();
    dto.id = 'u1';
    dto.email = 'u@test.com';
    dto.contraseña = 'hash';
    dto.role = Role.CLIENTE;

    expect(dto).toMatchObject({
      id: 'u1',
      email: 'u@test.com',
      contraseña: 'hash',
      role: Role.CLIENTE,
    });
  });
});

