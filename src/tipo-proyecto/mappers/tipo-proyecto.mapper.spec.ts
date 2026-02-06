import { aTipoProyectoDTO } from './tipo-proyecto.mapper';

const tipoEntity = {
  id: 'tp-1',
  nombre: 'Tipo',
  descripcion: 'Desc',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('TipoProyectoMapper', () => {
  it('aTipoProyectoDTO mapea entidad', () => {
    const dto = aTipoProyectoDTO(tipoEntity as never);

    expect(dto).toEqual({
      id: 'tp-1',
      nombre: 'Tipo',
      descripcion: 'Desc',
    });
  });
});
