import prisma from '../../lib/db';
import { ClienteRepository } from './cliente.repository';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    cliente: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    empleado: {
      update: jest.fn(),
    },
  },
}));

describe('ClienteRepository', () => {
  let repository: ClienteRepository;

  const clienteEntity = {
    id: 'cli-1',
    email: 'c@test.com',
    contraseña: 'hash',
    nombre: 'Cliente',
    telefono: '123',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(() => {
    repository = new ClienteRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create crea cliente', async () => {
    (prisma.cliente.create as jest.Mock).mockResolvedValue(clienteEntity);

    const result = await repository.create({
      email: 'c@test.com',
      contraseña: 'hash',
      nombre: 'Cliente',
      telefono: '123',
      role: 'CLIENTE',
    } as never);

    expect(prisma.cliente.create).toHaveBeenCalled();
    expect(result).toEqual(clienteEntity);
  });

  it('create lanza error por duplicado', async () => {
    (prisma.cliente.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

    await expect(
      repository.create({ email: 'c@test.com' } as never),
    ).rejects.toThrow('Cliente duplicado: c@test.com');
  });

  it('update actualiza cliente', async () => {
    (prisma.cliente.update as jest.Mock).mockResolvedValue(clienteEntity);

    const result = await repository.update({ id: 'cli-1' } as never);

    expect(prisma.cliente.update).toHaveBeenCalled();
    expect(result).toEqual(clienteEntity);
  });

  it('findAll devuelve clientes', async () => {
    (prisma.cliente.findMany as jest.Mock).mockResolvedValue([clienteEntity]);

    const result = await repository.findAll();

    expect(prisma.cliente.findMany).toHaveBeenCalledWith({
      where: {
        OR: [{ deletedAt: null }, { deletedAt: { not: { isSet: true } } }],
      },
    });
    expect(result).toHaveLength(1);
  });

  it('findByEmail busca por email', async () => {
    (prisma.cliente.findFirst as jest.Mock).mockResolvedValue(clienteEntity);

    const result = await repository.findByEmail('c@test.com');

    expect(prisma.cliente.findFirst).toHaveBeenCalled();
    expect(result).toEqual(clienteEntity);
  });

  it('findById busca por id', async () => {
    (prisma.cliente.findFirst as jest.Mock).mockResolvedValue(clienteEntity);

    const result = await repository.findById('cli-1');

    expect(prisma.cliente.findFirst).toHaveBeenCalled();
    expect(result).toEqual(clienteEntity);
  });

  it('delete marca deletedAt', async () => {
    (prisma.empleado.update as jest.Mock).mockResolvedValue(clienteEntity);

    await repository.delete('cli-1');

    expect(prisma.empleado.update).toHaveBeenCalledWith({
      where: { id: 'cli-1' },
      data: { deletedAt: expect.any(Date) },
    });
  });
});

