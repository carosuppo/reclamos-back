import { UpdateClienteDTO } from './update.cliente.dto';

describe('UpdateClienteDTO', () => {
  it('permite asignar propiedades opcionales', () => {
    const dto = new UpdateClienteDTO();
    dto.email = 'c@test.com';

    expect(dto).toMatchObject({ email: 'c@test.com' });
  });
});
