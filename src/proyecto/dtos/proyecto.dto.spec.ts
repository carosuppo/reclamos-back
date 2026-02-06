import { ProyectoDTO } from './proyecto.dto';

describe('ProyectoDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new ProyectoDTO();
    dto.id = 'p1';
    dto.nombre = 'Proyecto';
    dto.descripcion = null;
    dto.tipoProyectoId = 'tp-1';

    expect(dto).toMatchObject({
      id: 'p1',
      nombre: 'Proyecto',
      descripcion: null,
      tipoProyectoId: 'tp-1',
    });
  });
});
