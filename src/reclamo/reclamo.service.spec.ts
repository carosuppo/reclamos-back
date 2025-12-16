import { Test, TestingModule } from '@nestjs/testing';
import { ReclamoService } from './reclamo.service';
import { ReclamoValidator } from './validators/reclamo.validator';
import { AreaValidator } from './validators/area.validator';
import { ReclamoHelper } from './helpers/reclamo.helper';
import { EmpleadoService } from 'src/empleado/empleado.service';
import { CreateReclamoDto } from './dtos/create-reclamo.dto';
import { UpdateEstadoDto } from './dtos/update-estado.dto';
import { ReasignarAreaDto } from './dtos/reasignar-area.dto';
import { UpdateReclamoDto } from './dtos/update-reclamo.dto';
import { BadRequestException } from '@nestjs/common';
import { Estados } from '@prisma/client';
import { Medidas } from 'src/common/enums/medidas.enum';
import { toReclamoCreateData } from './mappers/toReclamoEntity';

const mockReclamo = {
  id: 'rec-123',
  tipoReclamoId: 'tr-001',
  proyectoId: 'proy-001',
  prioridad: Medidas.ALTO,
  criticidad: Medidas.MEDIO,
  descripcion: 'Test reclamo',
  estado: Estados.PENDIENTE,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  archivo: null,
};

const mockCambioEstado = {
  id: 'ce-001',
  reclamoId: 'rec-123',
  areaId: 'area-001',
  estado: Estados.PENDIENTE,
  descripcion: 'Inicial',
  fechaInicio: new Date(),
  fechaFin: null,
  empleadoId: 'emp-001',
  clienteId: null,
};

// DTO esperado EXACTO según toReclamoDto
const expectedReclamoDto = {
  id: 'rec-123',
  tipoReclamo: 'tr-001',
  proyecto: 'proy-001',
  prioridad: Medidas.ALTO,
  criticidad: Medidas.MEDIO,
  descripcion: 'Test reclamo',
  estado: Estados.PENDIENTE,
};

describe('ReclamoService', () => {
  let service: ReclamoService;

  const mockReclamoRepository = {
    create: jest.fn(),
    findByCliente: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    updateEstado: jest.fn(),
    reassignArea: jest.fn(),
    findAll: jest.fn(),
  };

  const mockValidator = {
    validateTipoReclamo: jest.fn(),
    validateProyecto: jest.fn(),
    validateReclamo: jest.fn(),
    validateArea: jest.fn(),
    validateCambioEstadoEmpleado: jest.fn(),
    validateCambioEstadoCliente: jest.fn(),
  };

  const mockAreaValidator = {
    validateArea: jest.fn(),
  };

  const mockHelper = {
    findLastCambioEstado: jest.fn(),
    findOne: jest.fn(),
  };

  const mockEmpleadoService = {
    findArea: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReclamoService,
        { provide: 'IReclamoRepository', useValue: mockReclamoRepository },
        { provide: ReclamoValidator, useValue: mockValidator },
        { provide: AreaValidator, useValue: mockAreaValidator },
        { provide: ReclamoHelper, useValue: mockHelper },
        { provide: EmpleadoService, useValue: mockEmpleadoService },
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
    it('debe crear un reclamo correctamente', async () => {
      const dto: CreateReclamoDto = {
        tipoReclamoId: 'tr-001',
        proyectoId: 'proy-001',
        prioridad: Medidas.ALTO,
        criticidad: Medidas.MEDIO,
        areaId: 'area-001',
        descripcion: 'Test',
      };
      const userId = 'cli-001';

      mockValidator.validateTipoReclamo.mockResolvedValue(true);
      mockValidator.validateProyecto.mockResolvedValue(true);
      mockReclamoRepository.create.mockResolvedValue({
        ...mockReclamo,
        cambioEstadoId: 'ce-001',
      });

      const result = await service.create(dto, userId);

      expect(mockValidator.validateTipoReclamo).toHaveBeenCalledWith(
        dto.tipoReclamoId,
      );
      expect(mockValidator.validateProyecto).toHaveBeenCalledWith(
        dto.proyectoId,
      );
      expect(mockReclamoRepository.create).toHaveBeenCalledWith(
        toReclamoCreateData(dto, userId),
        userId,
      );
      expect(result).toEqual(expectedReclamoDto);
    });
  });

  describe('findByCliente', () => {
    it('debe devolver reclamos del cliente', async () => {
      const clienteId = 'cli-001';
      mockReclamoRepository.findByCliente.mockResolvedValue([mockReclamo]);

      const result = await service.findByCliente(clienteId);

      expect(result).toEqual([expectedReclamoDto]);
    });
  });

  describe('update', () => {
    it('debe actualizar un reclamo', async () => {
      const id = 'rec-123';
      const dto: UpdateReclamoDto = { descripcion: 'Actualizado' };
      const userId = 'cli-001';

      mockHelper.findOne.mockResolvedValue(expectedReclamoDto);
      mockHelper.findLastCambioEstado.mockResolvedValue(mockCambioEstado);

      mockReclamoRepository.update.mockResolvedValue(mockReclamo);

      const result = await service.update(id, dto, userId);

      expect(mockHelper.findOne).toHaveBeenCalledWith(id);
      expect(mockHelper.findLastCambioEstado).toHaveBeenCalledWith(id);
      expect(mockReclamoRepository.update).toHaveBeenCalled();
      expect(result).toEqual(expectedReclamoDto); // Si update cambia descripción, ajusta expected aquí
    });
  });

  describe('updateEstado', () => {
    it('debe actualizar estado correctamente', async () => {
      const id = 'rec-123';
      const dto: UpdateEstadoDto = {
        estado: Estados.EN_PROCESO,
        descripcion: 'En proceso',
      };
      const userId = 'emp-001';

      mockValidator.validateReclamo.mockResolvedValue(true);
      mockHelper.findLastCambioEstado.mockResolvedValue(mockCambioEstado);
      mockValidator.validateCambioEstadoEmpleado.mockReturnValue(true);
      mockAreaValidator.validateArea.mockResolvedValue(true);

      mockReclamoRepository.updateEstado.mockResolvedValue(mockReclamo);

      const result = await service.updateEstado(id, dto, userId);

      expect(mockAreaValidator.validateArea).toHaveBeenCalledWith(
        mockCambioEstado.areaId,
        userId,
      );
      expect(mockReclamoRepository.updateEstado).toHaveBeenCalled();
      expect(result).toEqual(expectedReclamoDto);
    });
  });

  describe('reassignArea', () => {
    it('debe reasignar área correctamente', async () => {
      const id = 'rec-123';
      const dto: ReasignarAreaDto = {
        areaId: 'area-002',
        descripcion: 'Reasignado',
      };
      const userId = 'cli-001';

      mockValidator.validateReclamo.mockResolvedValue(true);
      mockValidator.validateArea.mockResolvedValue(true);
      mockHelper.findLastCambioEstado.mockResolvedValue(mockCambioEstado);
      mockAreaValidator.validateArea.mockResolvedValue(true);
      mockValidator.validateCambioEstadoCliente.mockReturnValue(undefined);

      mockReclamoRepository.reassignArea.mockResolvedValue(mockReclamo);

      const result = await service.reassignArea(id, dto, userId);

      expect(mockReclamoRepository.reassignArea).toHaveBeenCalled();
      expect(result).toEqual(expectedReclamoDto);
    });
  });

  describe('findByArea', () => {
    it('debe devolver reclamos del área del empleado', async () => {
      const userId = 'emp-001';
      const areaId = 'area-001';

      mockEmpleadoService.findArea.mockResolvedValue(areaId);
      mockReclamoRepository.findAll.mockResolvedValue([mockReclamo]);
      mockHelper.findLastCambioEstado.mockResolvedValue({
        ...mockCambioEstado,
        areaId,
      });

      const result = await service.findByArea(userId);

      expect(mockEmpleadoService.findArea).toHaveBeenCalledWith(userId);
      expect(result).toEqual([expectedReclamoDto]);
    });

    it('debe lanzar BadRequestException si el empleado no tiene área', async () => {
      const userId = 'emp-001';

      mockEmpleadoService.findArea.mockResolvedValue(null);

      await expect(service.findByArea(userId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findByArea(userId)).rejects.toThrow(
        'El empleado no tiene un area asignada.',
      );
    });
  });
});
