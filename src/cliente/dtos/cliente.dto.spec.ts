import { ClienteDTO } from './cliente.dto';

describe('ClienteDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new ClienteDTO();
    dto.id = 'cli-1';
    dto.email = 'c@test.com';
    dto.telefono = '123';
    dto.nombre = 'Cliente';

    expect(dto).toMatchObject({
      id: 'cli-1',
      email: 'c@test.com',
      telefono: '123',
      nombre: 'Cliente',
    });
  });
});
