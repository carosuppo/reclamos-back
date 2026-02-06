import { Test, TestingModule } from '@nestjs/testing';
import { TipoProyectoService } from './tipo-proyecto.service';
import { NotFoundException } from '@nestjs/common';
import { aTipoProyectoDTO } from './mappers/tipo-proyecto.mapper';

describe('TipoProyectoService', () => {
  let service: TipoProyectoService;

  const mockTipoProyectoEntity = {
    id: 'tipo-1',
    nombre: 'Reclamo Tecnico',
    descripcion: 'Proyectos relacionados con soporte tecnico',
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

  const mockTipoProyectoRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TipoProyectoService,
        {
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
      expect(result[0]).toEqual(aTipoProyectoDTO(mockTipoProyectoEntity as never));
      expect(result[1]).toEqual(aTipoProyectoDTO(mockTipoProyectoEntity2 as never));
    });

    it('debe devolver array vacio si no hay tipos de proyecto', async () => {
      mockTipoProyectoRepository.findAll.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('debe devolver un tipo de proyecto mapeado a DTO si existe', async () => {
      mockTipoProyectoRepository.findById.mockResolvedValue(mockTipoProyectoEntity);

      const result = await service.findById('tipo-1');

      expect(mockTipoProyectoRepository.findById).toHaveBeenCalledWith('tipo-1');
      expect(result).toEqual(aTipoProyectoDTO(mockTipoProyectoEntity as never));
    });

    it('debe lanzar NotFoundException si el tipo de proyecto no existe', async () => {
      mockTipoProyectoRepository.findById.mockResolvedValue(null);

      await expect(service.findById('tipo-999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findById('tipo-999')).rejects.toThrow(
        'No existe un tipo de proyecto con ese ID.',
      );
    });
  });
});
