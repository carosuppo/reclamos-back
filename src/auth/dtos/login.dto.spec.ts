import { LoginDTO } from './login.dto';

describe('LoginDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new LoginDTO();
    dto.email = 'user@test.com';
    dto.contraseña = 'Password123';

    expect(dto).toMatchObject({
      email: 'user@test.com',
      contraseña: 'Password123',
    });
  });
});
