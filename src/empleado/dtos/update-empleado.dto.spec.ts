import { UpdateEmpleadoDTO } from './update-empleado.dto';

describe('UpdateEmpleadoDTO', () => {
  it('permite asignar propiedades opcionales', () => {
    const dto = new UpdateEmpleadoDTO();
    dto.email = 'e@test.com';

    expect(dto).toMatchObject({ email: 'e@test.com' });
  });
});
