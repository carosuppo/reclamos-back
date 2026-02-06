import { CambioEstadoRepository } from './cambio-estado.repository';
import { Estados, CambioEstado } from '@prisma/client';
import prisma from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    cambioEstado: {
      findMany: jest.fn(),
    },
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
    descripcion: 'Descripcion',
    areaId: 'area-1',
  };

  beforeEach(() => {
    repository = new CambioEstadoRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('crea un cambio de estado correctamente', async () => {
      const tx = {
        cambioEstado: {
          create: jest.fn().mockResolvedValue(cambioEstadoEntity),
        },
      };

      const result = await repository.create(
        {
          reclamoId: 'reclamo-1',
          estado: Estados.PENDIENTE,
          clienteId: 'cliente-1',
          descripcion: 'Descripcion',
          areaId: 'area-1',
        },
        tx as never,
      );

      expect(tx.cambioEstado.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(cambioEstadoEntity);
    });

    it('lanza error cuando el tx falla', async () => {
      const tx = {
        cambioEstado: {
          create: jest.fn().mockRejectedValue(new Error('DB error')),
        },
      };

      await expect(
        repository.create({} as never, tx as never),
      ).rejects.toThrow('DB error');
    });
  });

  describe('close', () => {
    it('cierra los estados abiertos del reclamo', async () => {
      const tx = {
        cambioEstado: {
          updateMany: jest.fn().mockResolvedValue({ count: 1 }),
        },
      };

      await repository.close('reclamo-1', tx as never);

      expect(tx.cambioEstado.updateMany).toHaveBeenCalledWith({
        where: {
          id: 'reclamo-1',
          OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
        },
        data: { fechaFin: expect.any(Date) },
      });
    });

    it('lanza error cuando el tx falla', async () => {
      const tx = {
        cambioEstado: {
          updateMany: jest.fn().mockRejectedValue(new Error('DB error')),
        },
      };

      await expect(repository.close('reclamo-1', tx as never)).rejects.toThrow(
        'DB error',
      );
    });
  });

  describe('findByReclamoId', () => {
    it('devuelve cambios de estado por reclamoId', async () => {
      (prisma.cambioEstado.findMany as jest.Mock).mockResolvedValue([
        cambioEstadoEntity,
      ]);

      const result = await repository.findByReclamoId('reclamo-1');

      expect(prisma.cambioEstado.findMany).toHaveBeenCalledWith({
        where: { reclamoId: 'reclamo-1' },
        include: {
          empleado: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          cliente: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
          area: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findByEstado', () => {
    it('devuelve cambios de estado por estado', async () => {
      (prisma.cambioEstado.findMany as jest.Mock).mockResolvedValue([
        cambioEstadoEntity,
      ]);

      const result = await repository.findByEstado(Estados.PENDIENTE);

      expect(prisma.cambioEstado.findMany).toHaveBeenCalledWith({
        where: { estado: Estados.PENDIENTE },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findLastCambioEstado', () => {
    it('devuelve el ultimo cambio de estado', async () => {
      (prisma.cambioEstado.findMany as jest.Mock).mockResolvedValue([
        cambioEstadoEntity,
      ]);

      const result = await repository.findLastCambioEstado('reclamo-1');

      expect(prisma.cambioEstado.findMany).toHaveBeenCalledWith({
        where: { reclamoId: 'reclamo-1' },
        orderBy: { fechaInicio: 'desc' },
        take: 1,
      });
      expect(result).toEqual(cambioEstadoEntity);
    });

    it('devuelve undefined si no hay cambios de estado', async () => {
      (prisma.cambioEstado.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findLastCambioEstado('reclamo-1');

      expect(result).toBeUndefined();
    });
  });
});
