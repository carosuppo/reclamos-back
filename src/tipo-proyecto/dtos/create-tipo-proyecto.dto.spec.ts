import { CreateTipoProyectoDTO, UpdateTipoProyectoDto } from './create-tipo-proyecto.dto';

describe('CreateTipoProyectoDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new CreateTipoProyectoDTO();
    dto.nombre = 'Tipo';
    dto.descripcion = 'Desc';

    expect(dto).toMatchObject({ nombre: 'Tipo', descripcion: 'Desc' });
  });
});

describe('UpdateTipoProyectoDto', () => {
  it('permite propiedades parciales', () => {
    const dto = new UpdateTipoProyectoDto();
    dto.nombre = 'Nuevo';

    expect(dto).toMatchObject({ nombre: 'Nuevo' });
  });
});
