import { EmpleadoDTO } from './empleado.dto';

describe('EmpleadoDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new EmpleadoDTO();
    dto.id = 'emp-1';
    dto.email = 'e@test.com';
    dto.telefono = '123';
    dto.nombre = 'Empleado';
    dto.area = 'area-1';

    expect(dto).toMatchObject({
      id: 'emp-1',
      email: 'e@test.com',
      telefono: '123',
      nombre: 'Empleado',
      area: 'area-1',
    });
  });
});
