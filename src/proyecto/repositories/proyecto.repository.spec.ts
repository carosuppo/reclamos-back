import prisma from '../../lib/db';
import { ProyectoRepository } from './proyecto.repository';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    proyecto: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('ProyectoRepository', () => {
  let repository: ProyectoRepository;

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

  beforeEach(() => {
    repository = new ProyectoRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create crea proyecto', async () => {
    (prisma.proyecto.create as jest.Mock).mockResolvedValue(proyectoEntity);

    const result = await repository.create({
      nombre: 'Proyecto',
      clienteId: 'cli-1',
      descripcion: null,
      tipoProyectoId: 'tp-1',
    } as never);

    expect(prisma.proyecto.create).toHaveBeenCalled();
    expect(result).toEqual(proyectoEntity);
  });

  it('update actualiza proyecto', async () => {
    (prisma.proyecto.update as jest.Mock).mockResolvedValue(proyectoEntity);

    const result = await repository.update({ id: 'p1' } as never);

    expect(prisma.proyecto.update).toHaveBeenCalled();
    expect(result).toEqual(proyectoEntity);
  });

  it('findAll busca por cliente', async () => {
    (prisma.proyecto.findMany as jest.Mock).mockResolvedValue([proyectoEntity]);

    const result = await repository.findAll('cli-1');

    expect(prisma.proyecto.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('findById busca por id', async () => {
    (prisma.proyecto.findFirst as jest.Mock).mockResolvedValue(proyectoEntity);

    const result = await repository.findById('p1');

    expect(prisma.proyecto.findFirst).toHaveBeenCalled();
    expect(result).toEqual(proyectoEntity);
  });

  it('findByTipoProyecto busca por tipo y cliente', async () => {
    (prisma.proyecto.findMany as jest.Mock).mockResolvedValue([proyectoEntity]);

    const result = await repository.findByTipoProyecto('tp-1', 'cli-1');

    expect(prisma.proyecto.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('delete marca deletedAt', async () => {
    (prisma.proyecto.update as jest.Mock).mockResolvedValue(proyectoEntity);

    const result = await repository.delete('p1');

    expect(prisma.proyecto.update).toHaveBeenCalledWith({
      where: { id: 'p1' },
      data: { deletedAt: expect.any(Date) },
    });
    expect(result).toEqual(proyectoEntity);
  });
});
