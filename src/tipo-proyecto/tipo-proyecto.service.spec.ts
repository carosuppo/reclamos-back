import { Test, TestingModule } from '@nestjs/testing';
import { TipoProyectoService } from './tipo-proyecto.service';
import { NotFoundException } from '@nestjs/common';
import { aTipoProyectoDto } from './mapper/tipo-proyecto.mapper';

const mockTipoProyectoEntity = {
  id: 'tipo-1',
  nombre: 'Reclamo Técnico',
  descripcion: 'Proyectos relacionados con soporte técnico',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockTipoProyectoEntity2 = {
  id: 'tipo-2',
  nombre: 'Mejora de Producto',
  descripcion: 'Proyectos para nuevas funcionalidades',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('TipoProyectoService', () => {
  let service: TipoProyectoService;

  const mockTipoProyectoRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipoProyectoService,
        {
          // ← CLAVE: token EXACTAMENTE igual al del @Inject
          provide: 'ITipoProyectoRepository',
          useValue: mockTipoProyectoRepository,
        },
      ],
    }).compile();

    service = module.get<TipoProyectoService>(TipoProyectoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('debe devolver un array de tipos de proyecto mapeados a DTO', async () => {
      const tipos = [mockTipoProyectoEntity, mockTipoProyectoEntity2];

      mockTipoProyectoRepository.findAll.mockResolvedValue(tipos);

      const result = await service.findAll();

      expect(mockTipoProyectoRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(aTipoProyectoDto(mockTipoProyectoEntity));
      expect(result[1]).toEqual(aTipoProyectoDto(mockTipoProyectoEntity2));
    });

    it('debe devolver array vacío si no hay tipos de proyecto', async () => {
      mockTipoProyectoRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('debe devolver un tipo de proyecto mapeado a DTO si existe', async () => {
      mockTipoProyectoRepository.findOne.mockResolvedValue(
        mockTipoProyectoEntity,
      );

      const result = await service.findOne('tipo-1');

      expect(mockTipoProyectoRepository.findOne).toHaveBeenCalledWith('tipo-1');
      expect(result).toEqual(aTipoProyectoDto(mockTipoProyectoEntity));
    });

    it('debe lanzar NotFoundException si el tipo de proyecto no existe', async () => {
      mockTipoProyectoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('tipo-999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('tipo-999')).rejects.toThrow(
        'No existe un tipo de proyecto con ese ID.',
      );
    });
  });
});
