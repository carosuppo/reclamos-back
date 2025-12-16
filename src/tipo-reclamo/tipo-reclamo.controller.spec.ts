import { Test, TestingModule } from '@nestjs/testing';
import { TipoReclamoController } from './tipo-reclamo.controller';
import { TipoReclamoService } from './tipo-reclamo.service';

describe('TipoReclamoController', () => {
  let controller: TipoReclamoController;

  const mockTipoReclamoRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TipoReclamoController],
      providers: [
        TipoReclamoService,
        {
          provide: 'ITipoReclamoRepository',
          useValue: mockTipoReclamoRepository,
        },
      ],
    }).compile();

    controller = module.get<TipoReclamoController>(TipoReclamoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
