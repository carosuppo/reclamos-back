import prisma from '../../lib/db';
import { TipoProyectoRepository } from './tipo-proyecto.repository';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    tipoProyecto: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('TipoProyectoRepository', () => {
  let repository: TipoProyectoRepository;

  const tipoEntity = {
    id: 'tp-1',
    nombre: 'Tipo',
    descripcion: 'Desc',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    repository = new TipoProyectoRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('findAll devuelve tipos', async () => {
    (prisma.tipoProyecto.findMany as jest.Mock).mockResolvedValue([tipoEntity]);

    const result = await repository.findAll();

    expect(prisma.tipoProyecto.findMany).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });

  it('findById devuelve tipo', async () => {
    (prisma.tipoProyecto.findFirst as jest.Mock).mockResolvedValue(tipoEntity);

    const result = await repository.findById('tp-1');

    expect(prisma.tipoProyecto.findFirst).toHaveBeenCalled();
    expect(result).toEqual(tipoEntity);
  });
});
