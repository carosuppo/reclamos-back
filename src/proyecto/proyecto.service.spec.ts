import { Test, TestingModule } from '@nestjs/testing';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import { NotFoundException } from '@nestjs/common';
import { ProyectoValidador } from './validator/proyecto.validator';
import { aProyectoDto, aProyectoInterfaz } from './mapper/proyecto.mapper';

const mockProyectoEntity = {
  id: 'proy-123',
  nombre: 'Sistema de Reclamos',
  descripcion: 'Proyecto principal de gestión',
  tipoProyectoId: 'tipo-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('ProyectoService', () => {
  let service: ProyectoService;

  const mockProyectoRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByTipoProyecto: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockProyectoValidador = {
    validate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProyectoService,
        {
          provide: 'IProyectoRepository',
          useValue: mockProyectoRepository,
        },
        {
          provide: ProyectoValidador,
          useValue: mockProyectoValidador,
        },
      ],
    }).compile();

    service = module.get<ProyectoService>(ProyectoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un proyecto correctamente', async () => {
      const createDto: CreateProyectoDto = {
        nombre: 'Nuevo Proyecto',
        descripcion: 'Descripción opcional',
        tipoProyectoId: 'tipo-1',
      };

      mockProyectoValidador.validate.mockResolvedValue(true);
      mockProyectoRepository.create.mockResolvedValue(mockProyectoEntity);

      const result = await service.create(createDto);

      expect(mockProyectoValidador.validate).toHaveBeenCalledWith('tipo-1');
      expect(mockProyectoRepository.create).toHaveBeenCalledWith(
        aProyectoInterfaz(createDto),
      );
      expect(result).toEqual(aProyectoDto(mockProyectoEntity));
    });

    it('debe fallar si el tipoProyectoId no existe (validador lanza error)', async () => {
      const createDto: CreateProyectoDto = {
        nombre: 'Proyecto Inválido',
        tipoProyectoId: 'tipo-999',
      };

      mockProyectoValidador.validate.mockRejectedValue(
        new NotFoundException('Tipo de proyecto no encontrado'),
      );

      await expect(service.create(createDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockProyectoValidador.validate).toHaveBeenCalledWith('tipo-999');
    });
  });

  describe('findAll', () => {
    it('debe devolver un array de proyectos mapeados a DTO', async () => {
      const proyectos = [
        mockProyectoEntity,
        { ...mockProyectoEntity, id: 'proy-999' },
      ];

      mockProyectoRepository.findAll.mockResolvedValue(proyectos);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(aProyectoDto(mockProyectoEntity));
      expect(result[1]).toEqual(aProyectoDto(proyectos[1]));
    });
  });

  describe('findOne', () => {
    it('debe devolver un proyecto si existe', async () => {
      mockProyectoRepository.findOne.mockResolvedValue(mockProyectoEntity);

      const result = await service.findOne('proy-123');

      expect(result).toEqual(aProyectoDto(mockProyectoEntity));
    });

    it('debe lanzar NotFoundException si el proyecto no existe', async () => {
      mockProyectoRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('noexiste')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne('noexiste')).rejects.toThrow(
        'Proyecto no encontrado',
      );
    });
  });

  describe('findByTipoProyecto', () => {
    it('debe devolver proyectos filtrados por tipoProyectoId', async () => {
      const proyectosFiltrados = [mockProyectoEntity];

      mockProyectoRepository.findByTipoProyecto.mockResolvedValue(
        proyectosFiltrados,
      );

      const result = await service.findByTipoProyecto('tipo-1');

      expect(result).toEqual(proyectosFiltrados.map(aProyectoDto));
    });

    it('debe lanzar NotFoundException si no hay proyectos para ese tipo', async () => {
      mockProyectoRepository.findByTipoProyecto.mockResolvedValue([]);

      await expect(service.findByTipoProyecto('tipo-999')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findByTipoProyecto('tipo-999')).rejects.toThrow(
        'No hay proyectos con este tipo de proyecto',
      );
    });
  });

  describe('update', () => {
    it('debe actualizar sin validar tipo si no se cambia tipoProyectoId', async () => {
      const updateDto: UpdateProyectoDto = {
        nombre: 'Nombre Actualizado',
        descripcion: 'Nueva descripción',
      };

      const updatedEntity = { ...mockProyectoEntity, ...updateDto };

      mockProyectoRepository.update.mockResolvedValue(updatedEntity);

      const result = await service.update('proy-123', updateDto);

      expect(mockProyectoValidador.validate).not.toHaveBeenCalled();
      expect(mockProyectoRepository.update).toHaveBeenCalledWith(
        'proy-123',
        aProyectoInterfaz(updateDto),
      );
      expect(result).toEqual(aProyectoDto(updatedEntity));
    });

    it('debe validar tipoProyectoId si se incluye en el update', async () => {
      const updateDto: UpdateProyectoDto = {
        tipoProyectoId: 'tipo-nuevo',
      };

      mockProyectoValidador.validate.mockResolvedValue(true);
      mockProyectoRepository.update.mockResolvedValue({
        ...mockProyectoEntity,
        tipoProyectoId: 'tipo-nuevo',
      });

      await service.update('proy-123', updateDto);

      expect(mockProyectoValidador.validate).toHaveBeenCalledWith('tipo-nuevo');
    });
  });

  describe('remove', () => {
    it('debe llamar al repository.remove y devolver su resultado', async () => {
      mockProyectoRepository.remove.mockResolvedValue(true);

      const result = await service.remove('proy-123');

      expect(mockProyectoRepository.remove).toHaveBeenCalledWith('proy-123');
      expect(result).toBe(true);
    });
  });
});
