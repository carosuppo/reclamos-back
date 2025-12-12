import { Test, TestingModule } from '@nestjs/testing';
import { CambioEstadoService } from './cambio-estado.service';

describe('CambioEstadoService', () => {
  let service: CambioEstadoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CambioEstadoService],
    }).compile();

    service = module.get<CambioEstadoService>(CambioEstadoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
