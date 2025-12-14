import { Test, TestingModule } from '@nestjs/testing';
import { CambioEstadoController } from './cambio-estado.controller';
import { CambioEstadoService } from './cambio-estado.service';

describe('CambioEstadoController', () => {
  let controller: CambioEstadoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CambioEstadoController],
      providers: [CambioEstadoService],
    }).compile();

    controller = module.get<CambioEstadoController>(CambioEstadoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
