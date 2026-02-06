import { TipoProyectoDTO } from './tipo-proyecto.dto';

describe('TipoProyectoDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new TipoProyectoDTO();
    dto.id = 'tp-1';
    dto.nombre = 'Tipo';
    dto.descripcion = null;

    expect(dto).toMatchObject({
      id: 'tp-1',
      nombre: 'Tipo',
      descripcion: null,
    });
  });
});
