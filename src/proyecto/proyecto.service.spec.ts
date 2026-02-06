import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoMapper as mapper } from './mappers/proyecto.mapper';
import { TipoProyectoValidator } from '../tipo-proyecto/validators/tipo-proyecto.validator';

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

describe('ProyectoService', () => {
  let service: ProyectoService;

  const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByTipoProyecto: jest.fn(),
    delete: jest.fn(),
  };

  const mockValidator = {
    validateTipoProyecto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        { provide: 'IProyectoRepository', useValue: mockRepository },
        { provide: TipoProyectoValidator, useValue: mockValidator },
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create valida tipo y crea proyecto', async () => {
    await service.create(
      { nombre: 'Proyecto', tipoProyectoId: 'tp-1' } as never,
      'cli-1',
    );

    expect(mockValidator.validateTipoProyecto).toHaveBeenCalledWith('tp-1');
    expect(mockRepository.create).toHaveBeenCalled();
  });

  it('update valida tipo y actualiza', async () => {
    await service.update('p1', { tipoProyectoId: 'tp-1' } as never);

    expect(mockValidator.validateTipoProyecto).toHaveBeenCalledWith('tp-1');
    expect(mockRepository.update).toHaveBeenCalled();
  });

  it('findAll mapea proyectos', async () => {
    mockRepository.findAll.mockResolvedValue([proyectoEntity]);

    const result = await service.findAll('cli-1');

    expect(result).toEqual([mapper.aProyectoDTO(proyectoEntity as never)]);
  });

  it('findById devuelve proyecto', async () => {
    mockRepository.findById.mockResolvedValue(proyectoEntity);

    const result = await service.findById('p1');

    expect(result).toEqual(mapper.aProyectoDTO(proyectoEntity as never));
  });

  it('findById lanza NotFoundException si no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(service.findById('x')).rejects.toThrow(NotFoundException);
  });

  it('findByTipoProyecto lanza NotFoundException si no hay', async () => {
    mockRepository.findByTipoProyecto.mockResolvedValue([]);

    await expect(service.findByTipoProyecto('tp-1', 'cli-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('delete llama repositorio', async () => {
    await service.delete('p1');

    expect(mockRepository.delete).toHaveBeenCalledWith('p1');
  });
});
