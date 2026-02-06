import prisma from '../../lib/db';
import { AreaRepository } from './area.repository';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    area: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('AreaRepository', () => {
  let repository: AreaRepository;

  const areaEntity = {
    id: 'area-1',
    nombre: 'Ventas',
    descripcion: 'Area ventas',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    repository = new AreaRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create crea area', async () => {
    (prisma.area.create as jest.Mock).mockResolvedValue(areaEntity);

    const result = await repository.create({
      nombre: 'Ventas',
      descripcion: 'Area ventas',
    });

    expect(prisma.area.create).toHaveBeenCalledWith({
      data: { nombre: 'Ventas', descripcion: 'Area ventas' },
    });
    expect(result).toEqual(areaEntity);
  });

  it('update actualiza area', async () => {
    (prisma.area.update as jest.Mock).mockResolvedValue(areaEntity);

    const result = await repository.update({
      id: 'area-1',
      nombre: 'Ventas',
      descripcion: 'Area ventas',
    });

    expect(prisma.area.update).toHaveBeenCalledWith({
      where: {
        id: 'area-1',
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
      data: { nombre: 'Ventas', descripcion: 'Area ventas' },
    });
    expect(result).toEqual(areaEntity);
  });

  it('findAll devuelve areas activas', async () => {
    (prisma.area.findMany as jest.Mock).mockResolvedValue([areaEntity]);

    const result = await repository.findAll();

    expect(prisma.area.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
    expect(result).toHaveLength(1);
  });

  it('findById devuelve area', async () => {
    (prisma.area.findFirst as jest.Mock).mockResolvedValue(areaEntity);

    const result = await repository.findById('area-1');

    expect(prisma.area.findFirst).toHaveBeenCalledWith({
      where: {
        id: 'area-1',
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
    expect(result).toEqual(areaEntity);
  });

  it('findByName devuelve area', async () => {
    (prisma.area.findFirst as jest.Mock).mockResolvedValue(areaEntity);

    const result = await repository.findByName('Ventas');

    expect(prisma.area.findFirst).toHaveBeenCalledWith({
      where: { nombre: 'Ventas' },
    });
    expect(result).toEqual(areaEntity);
  });

  it('delete marca deletedAt', async () => {
    (prisma.area.update as jest.Mock).mockResolvedValue(areaEntity);

    const result = await repository.delete('area-1');

    expect(prisma.area.update).toHaveBeenCalledWith({
      where: {
        id: 'area-1',
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
      data: { deletedAt: expect.any(Date) },
    });
    expect(result).toEqual(areaEntity);
  });
});
