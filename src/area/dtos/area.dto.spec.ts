import { AreaDTO } from './area.dto';

describe('AreaDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new AreaDTO();
    dto.id = 'area-1';
    dto.nombre = 'Ventas';
    dto.descripcion = 'Area encargada de ventas';

    expect(dto).toMatchObject({
      id: 'area-1',
      nombre: 'Ventas',
      descripcion: 'Area encargada de ventas',
    });
  });
});
