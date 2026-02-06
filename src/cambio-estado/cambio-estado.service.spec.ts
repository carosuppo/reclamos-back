import { Test, TestingModule } from '@nestjs/testing';
import { Estados } from '@prisma/client';
import { CambioEstadoService } from './cambio-estado.service';
import { CambioEstadoMapper as mapper } from './mappers/cambio-estado.mapper';

const cambioEstadoEntity = {
  id: 'ce-1',
  reclamoId: 'rec-1',
  areaId: 'area-1',
  fechaInicio: new Date(),
  fechaFin: null,
  descripcion: 'Desc',
  estado: Estados.PENDIENTE,
  empleadoId: null,
  clienteId: 'cli-1',
  empleado: null,
  cliente: { id: 'cli-1', nombre: 'Cliente', email: 'c@c.com' },
  area: { id: 'area-1', nombre: 'Area' },
};

describe('CambioEstadoService', () => {
  let service: CambioEstadoService;

  const mockRepository = {
    findByReclamoId: jest.fn(),
    findByEstado: jest.fn(),
    findLastCambioEstado: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CambioEstadoService,
        { provide: 'ICambioEstadoRepository', useValue: mockRepository },
      ],
    }).compile();

    service = module.get<CambioEstadoService>(CambioEstadoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByReclamo', () => {
    it('devuelve cambios de estado mapeados', async () => {
      mockRepository.findByReclamoId.mockResolvedValue([cambioEstadoEntity]);

      const result = await service.findByReclamo('rec-1');

      expect(mockRepository.findByReclamoId).toHaveBeenCalledWith('rec-1');
      expect(result).toEqual([
        mapper.toCambioEstadoConUsuarioDTO(cambioEstadoEntity as never),
      ]);
    });
  });

  describe('findByEstado', () => {
    it('devuelve cambios por estado mapeados', async () => {
      mockRepository.findByEstado.mockResolvedValue([cambioEstadoEntity]);

      const result = await service.findByEstado(Estados.PENDIENTE);

      expect(mockRepository.findByEstado).toHaveBeenCalledWith(Estados.PENDIENTE);
      expect(result).toEqual([
        mapper.toCambioEstadoDTO(cambioEstadoEntity as never),
      ]);
    });
  });

  describe('findLastCambioEstado', () => {
    it('devuelve el ultimo cambio de estado mapeado', async () => {
      mockRepository.findLastCambioEstado.mockResolvedValue(cambioEstadoEntity);

      const result = await service.findLastCambioEstado('rec-1');

      expect(mockRepository.findLastCambioEstado).toHaveBeenCalledWith('rec-1');
      expect(result).toEqual(mapper.toCambioEstadoDTO(cambioEstadoEntity as never));
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findLastCambioEstado.mockResolvedValue(null);

      await expect(service.findLastCambioEstado('rec-1')).rejects.toThrow(
        'No se encontro el ultimo cambio de estado',
      );
    });
  });
});
