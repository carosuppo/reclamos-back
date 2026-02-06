import { CambioEstadoDTO } from './cambio-estado.dto';
import { Estados } from '@prisma/client';

describe('CambioEstadoDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new CambioEstadoDTO();
    dto.id = 'ce-1';
    dto.reclamoId = 'rec-1';
    dto.areaId = 'area-1';
    dto.fechaInicio = new Date();
    dto.fechaFin = null;
    dto.descripcion = 'Desc';
    dto.estado = Estados.PENDIENTE;
    dto.empleadoId = null;
    dto.clienteId = 'cli-1';

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
});
