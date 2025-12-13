import { Test, TestingModule } from '@nestjs/testing';
import { TipoReclamoService } from './tipo-reclamo.service';
import { TipoReclamoMapper } from './mappers/tipo-reclamo.mapper';

const mockTipoReclamoEntity: {
  id: string;
  nombre: string;
  descripcion: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
} = {
  id: 'tr-001',
  nombre: 'Reclamo 1',
  descripcion: 'Descripción 1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockTipoReclamoEntity2 = {
  id: 'tr-002',
  nombre: 'Error en facturación',
  descripcion: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('TipoReclamoService', () => {
  let service: TipoReclamoService;

  const mockTipoReclamoRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipoReclamoService,
        {
          // ← Token EXACTAMENTE igual al del @Inject en el service
          provide: 'ITipoReclamoRepository',
          useValue: mockTipoReclamoRepository,
        },
      ],
    }).compile();

    service = module.get<TipoReclamoService>(TipoReclamoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe devolver un array de TipoReclamoDto mapeados correctamente', async () => {
      const tipos = [mockTipoReclamoEntity, mockTipoReclamoEntity2];

      mockTipoReclamoRepository.findAll.mockResolvedValue(tipos);

      const result = await service.findAll();

      expect(mockTipoReclamoRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        TipoReclamoMapper.toTipoReclamoDto(mockTipoReclamoEntity),
      );
      expect(result[1]).toEqual({
        id: 'tr-002',
        nombre: 'Error en facturación',
        descripcion: undefined,
      });
    });

    it('debe devolver array vacío si no hay tipos de reclamo', async () => {
      mockTipoReclamoRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe devolver un TipoReclamoDto cuando el tipo existe', async () => {
      mockTipoReclamoRepository.findById.mockResolvedValue(
        mockTipoReclamoEntity,
      );

      const result = await service.findOne('tr-001');

      expect(mockTipoReclamoRepository.findById).toHaveBeenCalledWith('tr-001');
      expect(result).toEqual(
        TipoReclamoMapper.toTipoReclamoDto(mockTipoReclamoEntity),
      );
    });

    it('debe devolver el DTO mapeado incluso si descripcion es null', async () => {
      mockTipoReclamoRepository.findById.mockResolvedValue(
        mockTipoReclamoEntity2,
      );

      const result = await service.findOne('tr-002');

      expect(result).toEqual({
        id: 'tr-002',
        nombre: 'Error en facturación',
        descripcion: undefined,
      });
    });
  });
});
