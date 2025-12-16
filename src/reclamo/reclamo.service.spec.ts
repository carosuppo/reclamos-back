import { Test, TestingModule } from '@nestjs/testing';
import { ReclamoService } from './reclamo.service';
import { ReclamoValidator } from './validators/reclamo.validator';
import { ReclamoHelper } from './helpers/reclamo.helper';

describe('ReclamoService', () => {
  let service: ReclamoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReclamoService,
        // Mock del repository (string token)
        {
          provide: 'IReclamoRepository',
          useValue: {},
        },
        // Mock del validator
        {
          provide: ReclamoValidator,
          useValue: {},
        },
        // Mock del helper
        {
          provide: ReclamoHelper,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReclamoService>(ReclamoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
