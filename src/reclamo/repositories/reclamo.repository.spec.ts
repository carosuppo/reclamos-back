import { Estados, Reclamo } from '@prisma/client';
import { Medidas } from '../../common/enums/medidas.enum';
import prisma from '../../lib/db';
import { ReclamoRepository } from './reclamo.repository';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    $transaction: jest.fn(),
    reclamo: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
    },
  },
}));

describe('ReclamoRepository', () => {
  let repository: ReclamoRepository;

  const mockCambioEstadoRepository = {
    create: jest.fn(),
    close: jest.fn(),
  };

  const reclamoEntity = {
    id: 'rec-1',
    tipoReclamoId: 'tr-1',
    proyectoId: 'proy-1',
    prioridad: Medidas.ALTA,
    criticidad: Medidas.MEDIA,
    descripcion: 'Desc',
    estado: Estados.PENDIENTE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as Reclamo;

  beforeEach(() => {
    repository = new ReclamoRepository(mockCambioEstadoRepository as never);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('crea reclamo con cambio de estado inicial', async () => {
      const tx = {
        reclamo: {
          create: jest.fn().mockResolvedValue(reclamoEntity),
          update: jest.fn(),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb(tx));
      mockCambioEstadoRepository.create.mockResolvedValue({ id: 'ce-1' });

      const data = {
        tipoReclamoId: 'tr-1',
        proyectoId: 'proy-1',
        prioridad: Medidas.ALTA,
        criticidad: Medidas.MEDIA,
        areaId: 'area-1',
        descripcion: 'Desc',
        estado: Estados.PENDIENTE,
        clienteId: 'cli-1',
      };

      const result = await repository.create(data as never, 'cli-1');

      expect(tx.reclamo.create).toHaveBeenCalledWith({
        data: {
          tipoReclamoId: data.tipoReclamoId,
          proyectoId: data.proyectoId,
          prioridad: data.prioridad,
          criticidad: data.criticidad,
          descripcion: data.descripcion,
          estado: Estados.PENDIENTE,
        },
      });
      expect(mockCambioEstadoRepository.create).toHaveBeenCalledWith(
        {
          reclamoId: reclamoEntity.id,
          areaId: data.areaId,
          estado: Estados.PENDIENTE,
          clienteId: 'cli-1',
          descripcion: data.descripcion,
        },
        tx,
      );
      expect(result).toEqual({ ...reclamoEntity, cambioEstadoId: 'ce-1' });
    });

    it('lanza error si falla la transaccion', async () => {
      (prisma.$transaction as jest.Mock).mockRejectedValue(
        new Error('DB error'),
      );

      await expect(repository.create({} as never, 'cli-1')).rejects.toThrow(
        'Error al crear el reclamo con cambio de estado',
      );
    });
  });

  describe('update', () => {
    it('actualiza reclamo y crea nuevo cambio de estado', async () => {
      const tx = {
        reclamo: {
          update: jest.fn().mockResolvedValue(reclamoEntity),
          create: jest.fn(),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb(tx));
      mockCambioEstadoRepository.close.mockResolvedValue(undefined);
      mockCambioEstadoRepository.create.mockResolvedValue({ id: 'ce-2' });

      const data = {
        reclamoId: 'rec-1',
        tipoReclamoId: 'tr-1',
        prioridad: Medidas.ALTA,
        criticidad: Medidas.MEDIA,
        areaId: 'area-1',
        descripcion: 'Actualizado',
        estado: Estados.PENDIENTE,
        clienteId: 'cli-1',
      };

      const result = await repository.update(data as never);

      expect(tx.reclamo.update).toHaveBeenCalledWith({
        where: { id: data.reclamoId },
        data: {
          tipoReclamoId: data.tipoReclamoId,
          prioridad: data.prioridad,
          criticidad: data.criticidad,
          descripcion: data.descripcion,
          estado: data.estado,
        },
      });
      expect(mockCambioEstadoRepository.close).toHaveBeenCalledWith(
        reclamoEntity.id,
        tx,
      );
      expect(mockCambioEstadoRepository.create).toHaveBeenCalled();
      expect(result).toEqual({ ...reclamoEntity, cambioEstadoId: 'ce-2' });
    });
  });

  describe('changeEstado', () => {
    it('cambia estado y crea cambio', async () => {
      const tx = {
        reclamo: {
          update: jest.fn().mockResolvedValue(reclamoEntity),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb(tx));
      mockCambioEstadoRepository.close.mockResolvedValue(undefined);
      mockCambioEstadoRepository.create.mockResolvedValue({ id: 'ce-3' });

      const data = {
        reclamoId: 'rec-1',
        areaId: 'area-1',
        estado: Estados.EN_PROCESO,
        empleadoId: 'emp-1',
        descripcion: 'En proceso',
      };

      const result = await repository.changeEstado(data as never);

      expect(tx.reclamo.update).toHaveBeenCalledWith({
        where: { id: data.reclamoId },
        data: { estado: data.estado },
      });
      expect(mockCambioEstadoRepository.close).toHaveBeenCalledWith(
        reclamoEntity.id,
        tx,
      );
      expect(mockCambioEstadoRepository.create).toHaveBeenCalled();
      expect(result).toEqual({ ...reclamoEntity, cambioEstadoId: 'ce-3' });
    });
  });

  describe('reassignArea', () => {
    it('reasigna area y crea cambio', async () => {
      const tx = {
        reclamo: {
          update: jest.fn().mockResolvedValue(reclamoEntity),
        },
      };

      (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb(tx));
      mockCambioEstadoRepository.close.mockResolvedValue(undefined);
      mockCambioEstadoRepository.create.mockResolvedValue({ id: 'ce-4' });

      const data = {
        reclamoId: 'rec-1',
        areaId: 'area-2',
        estado: Estados.PENDIENTE,
        empleadoId: 'emp-1',
        descripcion: 'Reasignado',
      };

      const result = await repository.reassignArea(data as never);

      expect(tx.reclamo.update).toHaveBeenCalledWith({
        where: { id: data.reclamoId },
        data: { estado: data.estado },
      });
      expect(mockCambioEstadoRepository.close).toHaveBeenCalledWith(
        reclamoEntity.id,
        tx,
      );
      expect(mockCambioEstadoRepository.create).toHaveBeenCalled();
      expect(result).toEqual({ ...reclamoEntity, cambioEstadoId: 'ce-4' });
    });
  });

  describe('findByCliente', () => {
    it('busca reclamos por cliente', async () => {
      (prisma.reclamo.findMany as jest.Mock).mockResolvedValue([reclamoEntity]);

      const result = await repository.findByCliente('cli-1');

      expect(prisma.reclamo.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('findByArea', () => {
    it('busca reclamos por area', async () => {
      (prisma.reclamo.findMany as jest.Mock).mockResolvedValue([reclamoEntity]);

      const result = await repository.findByArea('area-1');

      expect(prisma.reclamo.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('busca reclamo por id', async () => {
      (prisma.reclamo.findFirst as jest.Mock).mockResolvedValue(reclamoEntity);

      const result = await repository.findById('rec-1');

      expect(prisma.reclamo.findFirst).toHaveBeenCalledWith({
        where: { id: 'rec-1' },
        include: {
          cambioEstado: true,
          tipoReclamo: { select: { id: true, nombre: true } },
          proyecto: {
            select: {
              id: true,
              nombre: true,
              cliente: { select: { id: true, nombre: true } },
            },
          },
        },
      });
      expect(result).toEqual(reclamoEntity);
    });
  });

  describe('findAll', () => {
    it('devuelve todos los reclamos activos', async () => {
      (prisma.reclamo.findMany as jest.Mock).mockResolvedValue([reclamoEntity]);

      const result = await repository.findAll();

      expect(prisma.reclamo.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
        },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findDates', () => {
    it('devuelve fechas por area y estado', async () => {
      (prisma.reclamo.findMany as jest.Mock).mockResolvedValue([
        { createdAt: new Date(), updatedAt: new Date() },
      ]);

      const result = await repository.findDates('area-1', Estados.RESUELTO);

      expect(prisma.reclamo.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
    });
  });

  describe('countByFiltros', () => {
    it('cuenta reclamos segun filtros', async () => {
      (prisma.reclamo.count as jest.Mock).mockResolvedValue(5);

      const filtros = {
        estado: Estados.PENDIENTE,
        clienteId: 'cli-1',
        fechaDesde: new Date('2026-01-01T00:00:00Z'),
        fechaHasta: new Date('2026-01-10T00:00:00Z'),
        areaId: 'area-1',
      };

      const result = await repository.countByFiltros(filtros as never);

      const hasta = new Date(filtros.fechaHasta);
      hasta.setDate(hasta.getDate() + 1);

      expect(prisma.reclamo.count).toHaveBeenCalledWith({
        where: {
          estado: filtros.estado,
          proyecto: { clienteId: filtros.clienteId },
          createdAt: { gte: filtros.fechaDesde, lt: hasta },
          cambioEstado: {
            some: {
              areaId: filtros.areaId,
              OR: [{ fechaFin: null }, { fechaFin: { not: { isSet: true } } }],
            },
          },
          OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
        },
      });
      expect(result).toBe(5);
    });
  });

  describe('countByArea', () => {
    it('cuenta reclamos por area', async () => {
      (prisma.reclamo.count as jest.Mock).mockResolvedValue(2);

      const result = await repository.countByArea('area-1', Estados.PENDIENTE);

      expect(prisma.reclamo.count).toHaveBeenCalled();
      expect(result).toBe(2);
    });
  });
});
