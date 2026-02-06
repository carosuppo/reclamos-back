import { CambioEstadoConUsuarioDTO } from './cambio-estado-con-usuario.dto';
import { Estados } from '@prisma/client';

describe('CambioEstadoConUsuarioDTO', () => {
  it('permite asignar propiedades', () => {
    const dto = new CambioEstadoConUsuarioDTO();
    dto.id = 'ce-1';
    dto.reclamoId = 'rec-1';
    dto.fechaInicio = new Date();
    dto.fechaFin = null;
    dto.descripcion = 'Desc';
    dto.estado = Estados.PENDIENTE;
    dto.usuario = { id: 'u1', nombre: 'User', email: 'u@u.com' };
    dto.area = { id: 'a1', nombre: 'Area' };

    expect(dto).toMatchObject({
      id: 'ce-1',
      reclamoId: 'rec-1',
      descripcion: 'Desc',
      estado: Estados.PENDIENTE,
      usuario: { id: 'u1', nombre: 'User', email: 'u@u.com' },
      area: { id: 'a1', nombre: 'Area' },
    });
  });
});
