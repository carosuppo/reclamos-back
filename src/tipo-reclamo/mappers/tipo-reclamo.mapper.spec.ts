import { toTipoReclamoDTO } from './tipo-reclamo.mapper';

const tipoEntity = {
  id: 'tr-1',
  nombre: 'Tipo',
  descripcion: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('TipoReclamoMapper', () => {
  it('toTipoReclamoDTO mapea entidad', () => {
    const dto = toTipoReclamoDTO(tipoEntity as never);

    expect(dto).toEqual({
      id: 'tr-1',
      nombre: 'Tipo',
      descripcion: undefined,
    });
  });
});
