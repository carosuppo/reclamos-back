import { UpdateCambioEstadoDTO } from './update-cambio-estado.dto';

describe('UpdateCambioEstadoDTO', () => {
  it('permite propiedades parciales', () => {
    const dto = new UpdateCambioEstadoDTO();
    dto.descripcion = 'Actualizado';

    expect(dto).toMatchObject({ descripcion: 'Actualizado' });
  });
});
