import { Test, TestingModule } from '@nestjs/testing';
import { ReclamoController } from './reclamo.controller';
import { ReclamoService } from './reclamo.service';
import { ReclamoValidator } from './validators/reclamo.validator';
import { ReclamoHelper } from './helpers/reclamo.helper';
import { TipoReclamoService } from '../tipo-reclamo/tipo-reclamo.service';
import { ProyectoService } from '../proyecto/proyecto.service';
import { AreaService } from '../area/area.service';

describe('ReclamoController', () => {
  let controller: ReclamoController;

  const mockReclamoService = {
    create: jest.fn(),
    findByCliente: jest.fn(),
    updateEstado: jest.fn(),
    reassignArea: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReclamoController],
      providers: [
        {
          provide: ReclamoService,
          useValue: mockReclamoService,
        },
        ReclamoValidator,
        ReclamoHelper,
        {
          provide: 'IReclamoRepository',
          useValue: {},
        },
        {
          provide: 'ICambioEstadoRepository',
          useValue: {},
        },
        {
          provide: TipoReclamoService,
          useValue: {},
        },
        {
          provide: ProyectoService,
          useValue: {},
        },
        {
          provide: AreaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ReclamoController>(ReclamoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
