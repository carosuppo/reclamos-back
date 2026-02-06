import { RegisterDTO } from './register.dto';

describe('RegisterDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new RegisterDTO();
    dto.email = 'user@test.com';
    dto.contraseña = 'Password123';
    dto.nombre = 'Juan Perez';
    dto.telefono = '3511234567';

    expect(dto).toMatchObject({
      email: 'user@test.com',
      contraseña: 'Password123',
      nombre: 'Juan Perez',
      telefono: '3511234567',
    });
  });
});
