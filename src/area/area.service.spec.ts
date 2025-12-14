import { Test, TestingModule } from '@nestjs/testing';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dtos/create-area.dto';
import { UpdateAreaDto } from './dtos/update-area.dto';

interface Area {
  id: string;
  nombre: string;
  descripcion?: string | null;
  deletedAt?: Date | null;
}

describe('AreaService', () => {
  let service: AreaService;

  // Mock del repository
  const mockAreaRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AreaService,
        {
          provide: 'IAreaRepository',
          useValue: mockAreaRepository,
        },
      ],
    }).compile();

    service = module.get<AreaService>(AreaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un área y devolver su DTO correctamente', async () => {
      const createDto: CreateAreaDto = {
        nombre: 'Ventas',
        descripcion: 'Área encargada de ventas',
      };

      const areaEntity: Area = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        nombre: 'Ventas',
        descripcion: 'Área encargada de ventas',
      };

      mockAreaRepository.create.mockResolvedValue(areaEntity);

      const result = await service.create(createDto);

      // Evitamos el warning de unbound-method usando .mock.calls
      expect(mockAreaRepository.create.mock.calls[0][0]).toEqual(createDto);
      expect(result).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        nombre: 'Ventas',
        descripcion: 'Área encargada de ventas',
      });
    });
  });

  describe('findAll', () => {
    it('debe devolver un array de AreaDto', async () => {
      const areasEntity: Area[] = [
        {
          id: '1',
          nombre: 'RRHH',
          descripcion: 'Recursos Humanos',
        },
        {
          id: '2',
          nombre: 'IT',
          descripcion: null,
        },
      ];

      mockAreaRepository.findAll.mockResolvedValue(areasEntity);

      const result = await service.findAll();

      expect(mockAreaRepository.findAll).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result).toEqual([
        { id: '1', nombre: 'RRHH', descripcion: 'Recursos Humanos' },
        { id: '2', nombre: 'IT', descripcion: undefined },
      ]);
    });
  });

  describe('findById', () => {
    it('debe devolver un AreaDto si el área existe', async () => {
      const areaEntity: Area = {
        id: '1',
        nombre: 'Marketing',
        descripcion: 'Área de marketing digital',
      };

      mockAreaRepository.findById.mockResolvedValue(areaEntity);

      const result = await service.findOne('1');

      expect(mockAreaRepository.findById.mock.calls[0][0]).toBe('1');
      expect(result).toEqual({
        id: '1',
        nombre: 'Marketing',
        descripcion: 'Área de marketing digital',
      });
    });

    it('debe devolver null si el área no existe', async () => {
      mockAreaRepository.findById.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('debe actualizar un área y devolver el DTO actualizado', async () => {
      const updateDto: UpdateAreaDto = {
        nombre: 'Ventas Actualizado',
      };

      const updatedEntity: Area = {
        id: '1',
        nombre: 'Ventas Actualizado',
        descripcion: 'Descripción original',
      };

      mockAreaRepository.update.mockResolvedValue(updatedEntity);

      const result = await service.update('1', updateDto);

      expect(mockAreaRepository.update.mock.calls[0][0]).toBe('1');
      expect(mockAreaRepository.update.mock.calls[0][1]).toEqual(updateDto);
      expect(result).toEqual({
        id: '1',
        nombre: 'Ventas Actualizado',
        descripcion: 'Descripción original',
      });
    });
  });

  describe('softDelete', () => {
    it('debe llamar al softDelete del repository', async () => {
      mockAreaRepository.softDelete.mockResolvedValue({ affected: 1 });

      const result = await service.softDelete('1');

      expect(mockAreaRepository.softDelete.mock.calls[0][0]).toBe('1');
      expect(result).toEqual({ affected: 1 });
    });
  });
});
