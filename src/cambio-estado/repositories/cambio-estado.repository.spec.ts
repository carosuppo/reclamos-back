import { CambioEstadoRepository } from './cambio-estado.repository';
import { Estados, CambioEstado } from '@prisma/client';
import prisma from '../../lib/db';

jest.mock('../../lib/db', () => ({
  cambioEstado: {
    create: jest.fn(),
    updateMany: jest.fn(),
    findMany: jest.fn(),
  },
}));

describe('CambioEstadoRepository', () => {
  let repository: CambioEstadoRepository;

  const cambioEstadoEntity: CambioEstado = {
    id: 'ce-1',
    reclamoId: 'reclamo-1',
    estado: Estados.PENDIENTE,
    fechaInicio: new Date(),
    fechaFin: null,
    clienteId: 'cliente-1',
    empleadoId: null,
    descripcion: 'Descripción',
    areaId: 'area-1',
  };

  beforeEach(() => {
    repository = new CambioEstadoRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ===============================
        create
     =============================== */

  describe('create', () => {
    it('creates a cambio de estado successfully', async () => {
      const createSpy = jest
        .spyOn(prisma.cambioEstado, 'create')
        .mockResolvedValue(cambioEstadoEntity);

      const result = await repository.create({
        reclamoId: 'reclamo-1',
        estado: Estados.PENDIENTE,
        clienteId: 'cliente-1',
        descripcion: 'Descripción',
        areaId: 'area-1',
      });

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result).toEqual(cambioEstadoEntity);
    });

    it('throws error when prisma fails', async () => {
      jest
        .spyOn(prisma.cambioEstado, 'create')
        .mockRejectedValue(new Error('DB error'));

      await expect(repository.create({} as never)).rejects.toThrow(
        'Error al crear el cambio de estado',
      );
    });
  });

  /* ===============================
        close
     =============================== */

  describe('close', () => {
    it('closes open estados of a reclamo', async () => {
      const updateManySpy = jest
        .spyOn(prisma.cambioEstado, 'updateMany')
        .mockResolvedValue({ count: 1 });

      await repository.close('reclamo-1');

      expect(updateManySpy).toHaveBeenCalledWith({
        where: {
          reclamoId: 'reclamo-1',
          OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
        },
        data: { fechaFin: expect.any(Date) },
      });
    });

    it('throws error when close fails', async () => {
      jest
        .spyOn(prisma.cambioEstado, 'updateMany')
        .mockRejectedValue(new Error('DB error'));

      await expect(repository.close('reclamo-1')).rejects.toThrow(
        'Error al cerrar el cambio de estado',
      );
    });
  });

  /* ===============================
        findByReclamoId
     =============================== */

  describe('findByReclamoId', () => {
    it('returns cambios de estado by reclamo', async () => {
      const findManySpy = jest
        .spyOn(prisma.cambioEstado, 'findMany')
        .mockResolvedValue([cambioEstadoEntity]);

      const result = await repository.findByReclamoId('reclamo-1');

      expect(findManySpy).toHaveBeenCalledWith({
        where: { reclamoId: 'reclamo-1' },
      });
      expect(result).toHaveLength(1);
    });

    it('throws error when prisma fails', async () => {
      jest
        .spyOn(prisma.cambioEstado, 'findMany')
        .mockRejectedValue(new Error('DB error'));

      await expect(repository.findByReclamoId('reclamo-1')).rejects.toThrow(
        'Error al obtener los cambios de estado',
      );
    });
  });

  /* ===============================
        findByEstado
     =============================== */

  describe('findByEstado', () => {
    it('returns cambios de estado by estado', async () => {
      const findManySpy = jest
        .spyOn(prisma.cambioEstado, 'findMany')
        .mockResolvedValue([cambioEstadoEntity]);

      const result = await repository.findByEstado(Estados.PENDIENTE);

      expect(findManySpy).toHaveBeenCalledWith({
        where: { estado: Estados.PENDIENTE },
      });
      expect(result).toHaveLength(1);
    });

    it('throws error when prisma fails', async () => {
      jest
        .spyOn(prisma.cambioEstado, 'findMany')
        .mockRejectedValue(new Error('DB error'));

      await expect(repository.findByEstado(Estados.PENDIENTE)).rejects.toThrow(
        'Error al obtener los cambios de estado',
      );
    });
  });

  /* ===============================
        findLastCambioEstado
     =============================== */

  describe('findLastCambioEstado', () => {
    it('returns the last cambio de estado', async () => {
      const findManySpy = jest
        .spyOn(prisma.cambioEstado, 'findMany')
        .mockResolvedValue([cambioEstadoEntity]);

      const result = await repository.findLastCambioEstado('reclamo-1');

      expect(findManySpy).toHaveBeenCalledWith({
        where: { reclamoId: 'reclamo-1' },
        orderBy: { fechaInicio: 'desc' },
        take: 1,
      });
      expect(result).toEqual(cambioEstadoEntity);
    });

    it('returns undefined when no cambios exist', async () => {
      jest.spyOn(prisma.cambioEstado, 'findMany').mockResolvedValue([]);

      const result = await repository.findLastCambioEstado('reclamo-1');

      expect(result).toBeUndefined();
    });

    it('calls prisma with correct params', async () => {
      const findManySpy = jest
        .spyOn(prisma.cambioEstado, 'findMany')
        .mockResolvedValue([cambioEstadoEntity]);

      await repository.findLastCambioEstado('reclamo-1');

      expect(findManySpy).toHaveBeenCalledTimes(1);
    });
  });
});
