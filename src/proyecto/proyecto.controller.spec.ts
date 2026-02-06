import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';

const mockService = {
  create: jest.fn(),
  update: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  findByTipoProyecto: jest.fn(),
  delete: jest.fn(),
};

describe('ProyectoController', () => {
  let controller: ProyectoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProyectoController],
      providers: [
        {
          provide: ProyectoService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ProyectoController>(ProyectoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('create llama service', async () => {
    mockService.create.mockResolvedValue(true);

    const result = await controller.create({} as never, 'cli-1');

    expect(mockService.create).toHaveBeenCalledWith({}, 'cli-1');
    expect(result).toBe(true);
  });

  it('update llama service', async () => {
    mockService.update.mockResolvedValue(true);

    const result = await controller.update('p1', {} as never);

    expect(mockService.update).toHaveBeenCalledWith('p1', {});
    expect(result).toBe(true);
  });

  it('findAll llama service', async () => {
    mockService.findAll.mockResolvedValue([]);

    const result = await controller.findAll('cli-1');

    expect(mockService.findAll).toHaveBeenCalledWith('cli-1');
    expect(result).toEqual([]);
  });

  it('findById llama service', async () => {
    mockService.findById.mockResolvedValue({} as never);

    const result = await controller.findById('p1');

    expect(mockService.findById).toHaveBeenCalledWith('p1');
    expect(result).toEqual({});
  });

  it('findByTipoProyecto llama service', async () => {
    mockService.findByTipoProyecto.mockResolvedValue([]);

    const result = await controller.findByTipoProyecto('tp-1', 'cli-1');

    expect(mockService.findByTipoProyecto).toHaveBeenCalledWith('tp-1', 'cli-1');
    expect(result).toEqual([]);
  });

  it('delete llama service', async () => {
    mockService.delete.mockResolvedValue(true);

    const result = await controller.delete('p1');

    expect(mockService.delete).toHaveBeenCalledWith('p1');
    expect(result).toBe(true);
  });
});
