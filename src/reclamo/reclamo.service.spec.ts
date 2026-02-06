import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Estados } from '@prisma/client';
import { CambioEstadoService } from '../cambio-estado/cambio-estado.service';
import { CambioEstadoMapper } from '../cambio-estado/mappers/cambio-estado.mapper';
import { Medidas } from '../common/enums/medidas.enum';
import { EmpleadoService } from '../empleado/empleado.service';
import { ReclamoHelper } from './helpers/reclamo.helper';
import { ReclamoMapper as mapper } from './mappers/reclamo.mapper';
import { ReclamoService } from './reclamo.service';
import { ReclamoValidator } from './validators/reclamo.validator';

describe('ReclamoService', () => {
  let service: ReclamoService;

  const mockRepository = {
    create: jest.fn(),
    update: jest.fn(),
    changeEstado: jest.fn(),
    reassignArea: jest.fn(),
    findById: jest.fn(),
    findByCliente: jest.fn(),
    findByArea: jest.fn(),
    findDates: jest.fn(),
    countByFiltros: jest.fn(),
    countByArea: jest.fn(),
  };

  const mockValidator = {
    validateCreate: jest.fn(),
    validateReclamo: jest.fn(),
    validateCambioEstado: jest.fn(),
    validateReassignArea: jest.fn(),
    validateArea: jest.fn(),
  };

  const mockHelper = {
    calcularTiempoResolucion: jest.fn(),
    calcularCantidadPromedio: jest.fn(),
  };

  const mockEmpleadoService = {
    findAreaById: jest.fn(),
  };

  const mockCambioEstadoService = {
    findLastCambioEstado: jest.fn(),
  };

  const reclamoEntity = {
    id: 'rec-1',
    tipoReclamoId: 'tr-1',
    proyectoId: 'proy-1',
    prioridad: Medidas.ALTA,
    criticidad: Medidas.MEDIA,
    descripcion: 'Descripcion',
    estado: Estados.PENDIENTE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  } as never;

  const reclamoCompletoEntity = {
    id: 'rec-1',
    tipoReclamoId: 'tr-1',
    proyectoId: 'proy-1',
    prioridad: Medidas.ALTA,
    criticidad: Medidas.MEDIA,
    descripcion: 'Descripcion',
    estado: Estados.PENDIENTE,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    tipoReclamo: { id: 'tr-1', nombre: 'Tipo' },
    proyecto: {
      id: 'proy-1',
      nombre: 'Proyecto',
      cliente: { id: 'cli-1', nombre: 'Cliente' },
    },
  } as never;

  const cambioEstadoDto = {
    id: 'ce-1',
    reclamoId: 'rec-1',
    areaId: 'area-1',
    fechaInicio: new Date(),
    fechaFin: null,
    descripcion: 'Desc',
    estado: Estados.PENDIENTE,
    empleadoId: null,
    clienteId: 'cli-1',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReclamoService,
        { provide: 'IReclamoRepository', useValue: mockRepository },
        { provide: ReclamoValidator, useValue: mockValidator },
        { provide: ReclamoHelper, useValue: mockHelper },
        { provide: EmpleadoService, useValue: mockEmpleadoService },
        { provide: CambioEstadoService, useValue: mockCambioEstadoService },
      ],
    }).compile();

    service = module.get<ReclamoService>(ReclamoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crea un reclamo correctamente', async () => {
      const dto = {
        tipoReclamoId: 'tr-1',
        proyectoId: 'proy-1',
        areaId: 'area-1',
        prioridad: Medidas.ALTA,
        criticidad: Medidas.MEDIA,
        descripcion: 'Desc',
      };
      const userId = 'cli-1';

      mockValidator.validateCreate.mockResolvedValue(undefined);
      mockRepository.create.mockResolvedValue(reclamoEntity);

      const result = await service.create(dto as never, userId);

      expect(mockValidator.validateCreate).toHaveBeenCalledWith(
        dto.tipoReclamoId,
        dto.proyectoId,
        dto.areaId,
      );
      expect(mockRepository.create).toHaveBeenCalledWith(
        mapper.toReclamoCreateData(dto as never, userId),
        userId,
      );
      expect(result).toEqual(mapper.toReclamoDTO(reclamoEntity));
    });
  });

  describe('update', () => {
    it('actualiza un reclamo', async () => {
      const id = 'rec-1';
      const dto = { descripcion: 'Actualizado' };
      const userId = 'cli-1';

      mockRepository.findById.mockResolvedValue(reclamoCompletoEntity);
      mockCambioEstadoService.findLastCambioEstado.mockResolvedValue(
        cambioEstadoDto,
      );
      mockRepository.update.mockResolvedValue(reclamoEntity);

      const expectedReclamoDto = mapper.toReclamoCompletoDTO(
        reclamoCompletoEntity,
      );

      const result = await service.update(id, dto as never, userId);

      expect(mockRepository.findById).toHaveBeenCalledWith(id);
      expect(mockCambioEstadoService.findLastCambioEstado).toHaveBeenCalledWith(
        id,
      );
      expect(mockRepository.update).toHaveBeenCalledWith(
        mapper.toReclamoUpdateData(
          id,
          dto as never,
          userId,
          expectedReclamoDto,
          cambioEstadoDto as never,
        ),
      );
      expect(result).toEqual(mapper.toReclamoDTO(reclamoEntity));
    });
  });

  describe('changeEstado', () => {
    it('actualiza estado correctamente', async () => {
      const id = 'rec-1';
      const dto = { estado: Estados.EN_PROCESO, descripcion: 'En proceso' };
      const userId = 'emp-1';

      mockValidator.validateReclamo.mockResolvedValue(undefined);
      mockCambioEstadoService.findLastCambioEstado.mockResolvedValue(
        cambioEstadoDto,
      );
      mockRepository.changeEstado.mockResolvedValue(reclamoEntity);

      const result = await service.changeEstado(id, dto as never, userId);

      expect(mockValidator.validateReclamo).toHaveBeenCalledWith(id);
      expect(mockValidator.validateCambioEstado).toHaveBeenCalledWith(
        cambioEstadoDto.estado,
        dto.estado,
      );
      expect(mockRepository.changeEstado).toHaveBeenCalledWith(
        CambioEstadoMapper.toCambioEstadoData(
          cambioEstadoDto as never,
          dto as never,
          userId,
        ),
      );
      expect(result).toEqual(mapper.toReclamoDTO(reclamoEntity));
    });
  });

  describe('reassignArea', () => {
    it('reasigna area correctamente', async () => {
      const id = 'rec-1';
      const dto = { areaId: 'area-2', descripcion: 'Reasignado' };
      const userId = 'cli-1';

      mockValidator.validateReassignArea.mockResolvedValue(undefined);
      mockCambioEstadoService.findLastCambioEstado.mockResolvedValue({
        ...cambioEstadoDto,
        estado: Estados.EN_PROCESO,
      });
      mockRepository.reassignArea.mockResolvedValue(reclamoEntity);

      const result = await service.reassignArea(id, dto as never, userId);

      expect(mockValidator.validateReassignArea).toHaveBeenCalledWith(
        id,
        dto.areaId,
      );
      expect(mockValidator.validateCambioEstado).toHaveBeenCalledWith(
        Estados.EN_PROCESO,
      );
      expect(mockRepository.reassignArea).toHaveBeenCalledWith(
        CambioEstadoMapper.toCambioEstadoClienteData(
          { ...cambioEstadoDto, estado: Estados.EN_PROCESO } as never,
          dto as never,
          userId,
        ),
      );
      expect(result).toEqual(mapper.toReclamoDTO(reclamoEntity));
    });
  });

  describe('findById', () => {
    it('devuelve reclamo completo', async () => {
      mockRepository.findById.mockResolvedValue(reclamoCompletoEntity);

      const result = await service.findById('rec-1');

      expect(result).toEqual(
        mapper.toReclamoCompletoDTO(reclamoCompletoEntity),
      );
    });

    it('lanza NotFoundException si no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById('rec-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByCliente', () => {
    it('devuelve reclamos del cliente', async () => {
      mockRepository.findByCliente.mockResolvedValue([reclamoCompletoEntity]);

      const result = await service.findByCliente('cli-1');

      expect(result).toEqual([
        mapper.toReclamoCompletoDTO(reclamoCompletoEntity),
      ]);
    });
  });

  describe('findByArea', () => {
    it('devuelve reclamos del area del empleado', async () => {
      mockEmpleadoService.findAreaById.mockResolvedValue('area-1');
      mockRepository.findByArea.mockResolvedValue([reclamoCompletoEntity]);

      const result = await service.findByArea('emp-1');

      expect(mockEmpleadoService.findAreaById).toHaveBeenCalledWith('emp-1');
      expect(result).toEqual([
        mapper.toReclamoCompletoDTO(reclamoCompletoEntity),
      ]);
    });
  });

  describe('countByFiltros', () => {
    it('cuenta reclamos por filtros', async () => {
      const dto = { estado: Estados.PENDIENTE };
      mockRepository.countByFiltros.mockResolvedValue(3);

      const result = await service.countByFiltros(dto as never);

      expect(mockRepository.countByFiltros).toHaveBeenCalledWith(
        mapper.toFiltrosReclamoData(dto as never),
      );
      expect(result).toBe(3);
    });
  });

  describe('getTiemProm', () => {
    it('calcula tiempo promedio de resolucion', async () => {
      mockValidator.validateArea.mockResolvedValue(undefined);
      mockRepository.findDates.mockResolvedValue([
        {
          createdAt: new Date('2026-01-01'),
          updatedAt: new Date('2026-01-02'),
        },
      ]);
      mockHelper.calcularTiempoResolucion.mockReturnValue(1.0);

      const result = await service.getTiemProm('area-1');

      expect(mockValidator.validateArea).toHaveBeenCalledWith('area-1');
      expect(mockRepository.findDates).toHaveBeenCalledWith(
        'area-1',
        Estados.RESUELTO,
      );
      expect(mockHelper.calcularTiempoResolucion).toHaveBeenCalled();
      expect(result).toBe(1.0);
    });
  });

  describe('getCantProm', () => {
    it('calcula cantidad promedio de resolucion', async () => {
      mockValidator.validateArea.mockResolvedValue(undefined);
      mockRepository.countByArea
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(4);
      mockHelper.calcularCantidadPromedio.mockReturnValue(0.4);

      const result = await service.getCantProm('area-1');

      expect(mockValidator.validateArea).toHaveBeenCalledWith('area-1');
      expect(mockRepository.countByArea).toHaveBeenNthCalledWith(1, 'area-1');
      expect(mockRepository.countByArea).toHaveBeenNthCalledWith(
        2,
        'area-1',
        Estados.RESUELTO,
      );
      expect(mockHelper.calcularCantidadPromedio).toHaveBeenCalledWith(4, 10);
      expect(result).toBe(0.4);
    });
  });
});
