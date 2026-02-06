import { ProyectoMapper } from './proyecto.mapper';

const proyectoEntity = {
  id: 'p1',
  nombre: 'Proyecto',
  descripcion: null,
  tipoProyectoId: 'tp-1',
  clienteId: 'cli-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('ProyectoMapper', () => {
  it('aProyectoDTO mapea entidad', () => {
    const dto = ProyectoMapper.aProyectoDTO(proyectoEntity as never);

    expect(dto).toEqual({
      id: 'p1',
      nombre: 'Proyecto',
      descripcion: null,
      tipoProyectoId: 'tp-1',
    });
  });

  it('aProyectoCreateData mapea dto con cliente', () => {
    const data = ProyectoMapper.aProyectoCreateData(
      {
        nombre: 'Proyecto',
        descripcion: 'Desc',
        tipoProyectoId: 'tp-1',
      } as never,
      'cli-1',
    );

    expect(data).toEqual({
      nombre: 'Proyecto',
      clienteId: 'cli-1',
      descripcion: 'Desc',
      tipoProyectoId: 'tp-1',
    });
  });

  it('aProyectoUpdateData agrega id', () => {
    const data = ProyectoMapper.aProyectoUpdateData('p1', {
      nombre: 'Nuevo',
    } as never);

    expect(data).toEqual({ id: 'p1', nombre: 'Nuevo' });
  });
});
