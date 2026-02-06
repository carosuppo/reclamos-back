import { CreateAreaDTO, UpdateAreaDTO } from './create-area.dto';

describe('CreateAreaDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new CreateAreaDTO();
    dto.nombre = 'Ventas';
    dto.descripcion = 'Area encargada de ventas';

    expect(dto).toMatchObject({
      nombre: 'Ventas',
      descripcion: 'Area encargada de ventas',
    });
  });
});

describe('UpdateAreaDTO', () => {
  it('permite propiedades parciales', () => {
    const dto = new UpdateAreaDTO();
    dto.nombre = 'Soporte';

    expect(dto).toMatchObject({
      nombre: 'Soporte',
    });
  });
});
