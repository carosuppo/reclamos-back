import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AreaService } from './area.service';
import { CreateAreaDTO, UpdateAreaDTO } from './dtos/create-area.dto';
import { AreaMapper as mapper } from './mappers/area.mapper';

describe('AreaService', () => {
  let service: AreaService;

  const mockAreaRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByName: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const areaEntity = {
    id: '1',
    nombre: 'Ventas',
    descripcion: 'Area encargada de ventas',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
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
    it('crea un area y devuelve true', async () => {
      const createDto: CreateAreaDTO = {
        nombre: 'Ventas',
        descripcion: 'Area encargada de ventas',
      };

      mockAreaRepository.create.mockResolvedValue(areaEntity);

      const result = await service.create(createDto);

      expect(mockAreaRepository.create).toHaveBeenCalledWith(
        mapper.toAreaCreateData(createDto),
      );
      expect(result).toBe(true);
    });
  });

  describe('update', () => {
    it('actualiza un area y devuelve true', async () => {
      const updateDto: UpdateAreaDTO = { nombre: 'Ventas Actualizado' };

      mockAreaRepository.update.mockResolvedValue(areaEntity);

      const result = await service.update('1', updateDto);

      expect(mockAreaRepository.update).toHaveBeenCalledWith(
        mapper.toAreaUpdateData('1', updateDto),
      );
      expect(result).toBe(true);
    });
  });

  describe('findAll', () => {
    it('devuelve un array de AreaDTO', async () => {
      mockAreaRepository.findAll.mockResolvedValue([areaEntity]);

      const result = await service.findAll();

      expect(mockAreaRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual([mapper.toAreaDto(areaEntity as never)]);
    });
  });

  describe('findById', () => {
    it('devuelve AreaDTO si existe', async () => {
      mockAreaRepository.findById.mockResolvedValue(areaEntity);

      const result = await service.findById('1');

      expect(mockAreaRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mapper.toAreaDto(areaEntity as never));
    });

    it('lanza NotFoundException si no existe', async () => {
      mockAreaRepository.findById.mockResolvedValue(null);

      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByNombre', () => {
    it('devuelve AreaDTO si existe', async () => {
      mockAreaRepository.findByName.mockResolvedValue(areaEntity);

      const result = await service.findByNombre('Ventas');

      expect(mockAreaRepository.findByName).toHaveBeenCalledWith('Ventas');
      expect(result).toEqual(mapper.toAreaDto(areaEntity as never));
    });

    it('lanza NotFoundException si no existe', async () => {
      mockAreaRepository.findByName.mockResolvedValue(null);

      await expect(service.findByNombre('X')).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('elimina un area y devuelve true', async () => {
      mockAreaRepository.delete.mockResolvedValue(true);

      const result = await service.delete('1');

      expect(mockAreaRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });
  });
});
