import { Estados } from '@prisma/client';
import { CambioEstadoMapper } from './cambio-estado.mapper';

const cambioEstadoEntity = {
  id: 'ce-1',
  reclamoId: 'rec-1',
  areaId: 'area-1',
  fechaInicio: new Date(),
  fechaFin: null,
  descripcion: 'Desc',
  estado: Estados.PENDIENTE,
  empleadoId: null,
  clienteId: 'cli-1',
};

describe('CambioEstadoMapper', () => {
  it('toCambioEstadoDTO mapea campos', () => {
    const dto = CambioEstadoMapper.toCambioEstadoDTO(cambioEstadoEntity as never);

    expect(dto).toMatchObject({
      id: 'ce-1',
      reclamoId: 'rec-1',
      areaId: 'area-1',
      descripcion: 'Desc',
      estado: Estados.PENDIENTE,
      empleadoId: null,
      clienteId: 'cli-1',
    });
  });

  it('toCambioEstadoConUsuarioDTO mapea usuario y area', () => {
    const fullEntity = {
      ...cambioEstadoEntity,
      empleado: { id: 'e1', nombre: 'Emp', email: 'e@e.com' },
      cliente: null,
      area: { id: 'a1', nombre: 'Area' },
    };

    const dto = CambioEstadoMapper.toCambioEstadoConUsuarioDTO(fullEntity as never);

    expect(dto).toMatchObject({
      id: 'ce-1',
      reclamoId: 'rec-1',
      area: { id: 'a1', nombre: 'Area' },
      usuario: { id: 'e1', nombre: 'Emp', email: 'e@e.com' },
    });
  });

  it('toCambioEstadoCreateData mapea dto a data', () => {
    const data = CambioEstadoMapper.toCambioEstadoCreateData({
      clienteId: 'cli-1',
      reclamoId: 'rec-1',
      areaId: 'area-1',
      empleadoId: 'emp-1',
      estado: Estados.PENDIENTE,
      descripcion: 'Desc',
    } as never);

    expect(data).toEqual({
      clienteId: 'cli-1',
      reclamoId: 'rec-1',
      areaId: 'area-1',
      empleadoId: 'emp-1',
      estado: Estados.PENDIENTE,
      descripcion: 'Desc',
    });
  });

  it('toCambioEstadoData mapea cambio de estado', () => {
    const data = CambioEstadoMapper.toCambioEstadoData(
      cambioEstadoEntity as never,
      { estado: Estados.EN_PROCESO, descripcion: 'En proceso' } as never,
      'emp-1',
    );

    expect(data).toEqual({
      reclamoId: 'rec-1',
      areaId: 'area-1',
      empleadoId: 'emp-1',
      estado: Estados.EN_PROCESO,
      descripcion: 'En proceso',
    });
  });

  it('toCambioEstadoClienteData mapea reasignacion', () => {
    const data = CambioEstadoMapper.toCambioEstadoClienteData(
      cambioEstadoEntity as never,
      { areaId: 'area-2', descripcion: 'Reasignado' } as never,
      'cli-2',
    );

    expect(data).toEqual({
      reclamoId: 'rec-1',
      areaId: 'area-2',
      clienteId: 'cli-2',
      estado: Estados.PENDIENTE,
      descripcion: 'Reasignado',
    });
  });
});
