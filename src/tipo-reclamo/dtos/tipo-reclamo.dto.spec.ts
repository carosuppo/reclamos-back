import { TipoReclamoDTO } from './tipo-reclamo.dto';

describe('TipoReclamoDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new TipoReclamoDTO();
    dto.id = 'tr-1';
    dto.nombre = 'Tipo';
    dto.descripcion = 'Desc';

    expect(dto).toMatchObject({
      id: 'tr-1',
      nombre: 'Tipo',
      descripcion: 'Desc',
    });
  });
});
