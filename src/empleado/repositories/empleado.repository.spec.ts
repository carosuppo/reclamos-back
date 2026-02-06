import prisma from '../../lib/db';
import { EmpleadoRepository } from './empleado.repository';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    empleado: {
      create: jest.fn(),
      update: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}));

describe('EmpleadoRepository', () => {
  let repository: EmpleadoRepository;

  const empleadoEntity = {
    id: 'emp-1',
    email: 'e@test.com',
    contraseña: 'hash',
    nombre: 'Empleado',
    telefono: '123',
    areaId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    repository = new EmpleadoRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create crea empleado', async () => {
    (prisma.empleado.create as jest.Mock).mockResolvedValue(empleadoEntity);

    const result = await repository.create({
      email: 'e@test.com',
      contraseña: 'hash',
      nombre: 'Empleado',
      telefono: '123',
      role: 'EMPLEADO',
    } as never);

    expect(prisma.empleado.create).toHaveBeenCalled();
    expect(result).toEqual(empleadoEntity);
  });

  it('update actualiza empleado', async () => {
    (prisma.empleado.update as jest.Mock).mockResolvedValue(empleadoEntity);

    const result = await repository.update({ id: 'emp-1' } as never);

    expect(prisma.empleado.update).toHaveBeenCalled();
    expect(result).toEqual(empleadoEntity);
  });

  it('assignArea actualiza area', async () => {
    (prisma.empleado.update as jest.Mock).mockResolvedValue(empleadoEntity);

    const result = await repository.assignArea('emp-1', 'area-1');

    expect(prisma.empleado.update).toHaveBeenCalledWith({
      where: { id: 'emp-1' },
      data: { areaId: 'area-1' },
    });
    expect(result).toEqual(empleadoEntity);
  });

  it('findById busca empleado', async () => {
    (prisma.empleado.findFirst as jest.Mock).mockResolvedValue(empleadoEntity);

    const result = await repository.findById('emp-1');

    expect(prisma.empleado.findFirst).toHaveBeenCalled();
    expect(result).toEqual(empleadoEntity);
  });

  it('findByEmail busca empleado', async () => {
    (prisma.empleado.findFirst as jest.Mock).mockResolvedValue(empleadoEntity);

    const result = await repository.findByEmail('e@test.com');

    expect(prisma.empleado.findFirst).toHaveBeenCalled();
    expect(result).toEqual(empleadoEntity);
  });

  it('delete marca deletedAt', async () => {
    (prisma.empleado.update as jest.Mock).mockResolvedValue(empleadoEntity);

    await repository.delete('emp-1');

    expect(prisma.empleado.update).toHaveBeenCalledWith({
      where: { id: 'emp-1' },
      data: { deletedAt: expect.any(Date) },
    });
  });
});
