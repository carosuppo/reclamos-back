import prisma from '../../lib/db';
import { TipoReclamoRepository } from './tipo-reclamo.repository';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    tipoReclamo: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('TipoReclamoRepository', () => {
  let repository: TipoReclamoRepository;

  const tipoEntity = {
    id: 'tr-1',
    nombre: 'Tipo',
    descripcion: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    repository = new TipoReclamoRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll devuelve tipos', async () => {
    (prisma.tipoReclamo.findMany as jest.Mock).mockResolvedValue([tipoEntity]);

    const result = await repository.findAll();

    expect(prisma.tipoReclamo.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('findById devuelve tipo', async () => {
    (prisma.tipoReclamo.findFirst as jest.Mock).mockResolvedValue(tipoEntity);

    const result = await repository.findById('tr-1');

    expect(prisma.tipoReclamo.findFirst).toHaveBeenCalled();
    expect(result).toEqual(tipoEntity);
  });
});
