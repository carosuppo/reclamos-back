import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TipoReclamoService } from './tipo-reclamo.service';
import { toTipoReclamoDTO } from './mappers/tipo-reclamo.mapper';

describe('TipoReclamoService', () => {
  let service: TipoReclamoService;

  const mockRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  const tipoReclamoEntity = {
    id: 'tr-1',
    nombre: 'Soporte',
    descripcion: 'Soporte tecnico',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipoReclamoService,
        { provide: 'ITipoReclamoRepository', useValue: mockRepository },
      ],
    }).compile();

    service = module.get<TipoReclamoService>(TipoReclamoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('devuelve tipos de reclamo mapeados', async () => {
      mockRepository.findAll.mockResolvedValue([tipoReclamoEntity]);

      const result = await service.findAll();

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([toTipoReclamoDTO(tipoReclamoEntity as never)]);
    });
  });

  describe('findById', () => {
    it('devuelve tipo de reclamo si existe', async () => {
      mockRepository.findById.mockResolvedValue(tipoReclamoEntity);

      const result = await service.findById('tr-1');

      expect(mockRepository.findById).toHaveBeenCalledWith('tr-1');
      expect(result).toEqual(toTipoReclamoDTO(tipoReclamoEntity as never));
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('tr-x')).rejects.toThrow(NotFoundException);
    });
  });
});
