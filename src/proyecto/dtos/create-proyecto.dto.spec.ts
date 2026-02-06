import { CreateProyectoDTO, UpdateProyectoDTO } from './create-proyecto.dto';

describe('CreateProyectoDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new CreateProyectoDTO();
    dto.nombre = 'Proyecto';
    dto.descripcion = 'Desc';
    dto.tipoProyectoId = 'tp-1';

    expect(dto).toMatchObject({
      nombre: 'Proyecto',
      descripcion: 'Desc',
      tipoProyectoId: 'tp-1',
    });
  });
});

describe('UpdateProyectoDTO', () => {
  it('permite propiedades parciales', () => {
    const dto = new UpdateProyectoDTO();
    dto.nombre = 'Nuevo';

    expect(dto).toMatchObject({ nombre: 'Nuevo' });
  });
});
