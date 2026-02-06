import { CreateCambioEstadoDTO } from './create-cambio-estado.dto';
import { Estados } from '@prisma/client';

describe('CreateCambioEstadoDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new CreateCambioEstadoDTO();
    dto.reclamoId = 'rec-1';
    dto.areaId = 'area-1';
    dto.estado = Estados.PENDIENTE;
    dto.descripcion = 'Desc';
    dto.clienteId = 'cli-1';

    expect(dto).toMatchObject({
      reclamoId: 'rec-1',
      areaId: 'area-1',
      estado: Estados.PENDIENTE,
      descripcion: 'Desc',
      clienteId: 'cli-1',
    });
  });
});
