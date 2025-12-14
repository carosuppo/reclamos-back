import { Test, TestingModule } from '@nestjs/testing';
import { CambioEstadoController } from './cambio-estado.controller';
import { CambioEstadoService } from './cambio-estado.service';
import { Estados } from '@prisma/client';
import type { CambioEstadoDto } from './dto/cambio-estado.dto';

describe('CambioEstadoController', () => {
  let controller: CambioEstadoController;

  const mockCambioEstadoService: jest.Mocked<CambioEstadoService> = {
    setEstadoInicial: jest.fn(),
    setEstadoEnProceso: jest.fn(),
    setEstadoTerminado: jest.fn(),
    findByReclamo: jest.fn(),
    findByEstado: jest.fn(),
  } as unknown as jest.Mocked<CambioEstadoService>;

  const cambioEstadoDto: CambioEstadoDto = {
    id: 'ce-1',
    reclamoId: 'reclamo-1',
    estado: Estados.PENDIENTE,
    fechaInicio: new Date(),
    fechaFin: null,
    clienteId: 'cliente-1',
    empleadoId: null,
    descripcion: 'Descripción del cambio de estado',
    areaId: 'area-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CambioEstadoController],
      providers: [
        {
          provide: CambioEstadoService,
          useValue: mockCambioEstadoService,
        },
      ],
    }).compile();

    controller = module.get<CambioEstadoController>(CambioEstadoController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ===============================
        findByReclamo
     =============================== */

  describe('findByReclamo', () => {
    it('delegates to service.findByReclamo and returns the result', async () => {
      const findByReclamoSpy = jest
        .spyOn(mockCambioEstadoService, 'findByReclamo')
        .mockResolvedValue([cambioEstadoDto]);

      const result = await controller.findByReclamo('reclamo-1');

      expect(findByReclamoSpy).toHaveBeenCalledWith('reclamo-1');
      expect(result).toHaveLength(1);
      expect(result[0].reclamoId).toBe('reclamo-1');
    });
  });

  /* ===============================
        findByEstado
     =============================== */

  describe('findByEstado', () => {
    it('delegates to service.findByEstado and returns the result', async () => {
      const findByEstadoSpy = jest
        .spyOn(mockCambioEstadoService, 'findByEstado')
        .mockResolvedValue([cambioEstadoDto]);

      const result = await controller.findByEstado('pendiente');

      expect(findByEstadoSpy).toHaveBeenCalledWith('pendiente');
      expect(result).toHaveLength(1);
      expect(result[0].estado).toBe(Estados.PENDIENTE);
    });
  });
});
