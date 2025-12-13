import { Test, TestingModule } from '@nestjs/testing';
import { ReclamoService } from './reclamo.service';
import { CreateReclamoDto } from './dtos/create-reclamo.dto';
import { UpdateEstadoDto } from './dtos/update-estado.dto';
import { ReasignarAreaDto } from './dtos/reasignar-area.dto';
import { ReclamoValidator } from './validators/reclamo.validator';
import { ReclamoHelper } from './helper/reclamo.helper';
import { toReclamoCreateData } from './mappers/toReclamoEntity';
import { toReclamoDto } from './mappers/toReclamoDto';
import { Estados } from '@prisma/client';
import { Medidas } from '../common/enums/medidas.enum';
import type { CambioEstadoCreateData } from '../cambio-estado/interfaces/cambioEstado-create.interface';
import type { CambioEstado } from '@prisma/client';
import type { Reclamo } from '@prisma/client';

const mockReclamoEntity: Reclamo = {
  id: 'rec-123',
  tipoReclamoId: 'tr-001',
  proyectoId: 'proy-001',
  estado: Estados.PENDIENTE,
  prioridad: 'ALTA',
  criticidad: 'MEDIA',
  archivo: null,
  descripcion: 'Descripción del reclamo',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const mockCambioEstadoEntity: CambioEstado = {
  id: 'ce-001',
  reclamoId: 'rec-123',
  empleadoId: null,
  clienteId: 'cli-001',
  areaId: 'area-001',
  fechaInicio: new Date(),
  fechaFin: null,
  descripcion: 'Estado inicial',
  estado: Estados.PENDIENTE,
};

describe('ReclamoService', () => {
  let service: ReclamoService;

  const mockReclamoRepository = {
    create: jest.fn(),
    findByCliente: jest.fn(),
    updateEstado: jest.fn(),
    reassignArea: jest.fn(),
  };

  const mockValidator = {
    validateTipoReclamo: jest.fn(),
    validateProyecto: jest.fn(),
    validateReclamo: jest.fn(),
    validateArea: jest.fn(),
    validateCambioEstadoEmpleado: jest.fn(),
    validateCambioEstadoCliente: jest.fn(),
  };

  const mockHelper = {
    findLastCambioEstado: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReclamoService,
        {
          provide: 'IReclamoRepository',
          useValue: mockReclamoRepository,
        },
        {
          provide: ReclamoValidator,
          useValue: mockValidator,
        },
        {
          provide: ReclamoHelper,
          useValue: mockHelper,
        },
      ],
    }).compile();

    service = module.get<ReclamoService>(ReclamoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear un reclamo correctamente y devolver ReclamoDto', async () => {
      const createDto: CreateReclamoDto = {
        tipoReclamoId: 'tr-001',
        descripcion: 'Nuevo reclamo de prueba',
        prioridad: Medidas.ALTA,
        criticidad: Medidas.MEDIA,
        areaId: 'area-001',
        proyectoId: 'proy-001',
      };
      const userId = 'cli-001';

      mockValidator.validateTipoReclamo.mockResolvedValue(true);
      mockValidator.validateProyecto.mockResolvedValue(true);

      const mockCreatedReclamo = {
        ...mockReclamoEntity,
        cambioEstadoId: 'ce-001',
      };
      mockReclamoRepository.create.mockResolvedValue(mockCreatedReclamo);

      const result = await service.create(createDto, userId);

      expect(mockValidator.validateTipoReclamo).toHaveBeenCalledWith(
        createDto.tipoReclamoId,
      );
      expect(mockValidator.validateProyecto).toHaveBeenCalledWith(
        createDto.proyectoId,
      );
      expect(mockReclamoRepository.create).toHaveBeenCalledWith(
        toReclamoCreateData(createDto, userId),
        userId,
      );
      expect(result).toEqual(toReclamoDto(mockCreatedReclamo));
    });

    it('debe fallar si validateTipoReclamo lanza error', async () => {
      const createDto: CreateReclamoDto = {
        tipoReclamoId: 'invalid',
        descripcion: 'Invalid',
        prioridad: Medidas.ALTA,
        criticidad: Medidas.MEDIA,
        areaId: 'area-001',
        proyectoId: 'proy-001',
      };
      const userId = 'cli-001';

      mockValidator.validateTipoReclamo.mockRejectedValue(
        new Error('Tipo de reclamo inválido'),
      );

      await expect(service.create(createDto, userId)).rejects.toThrow(
        'Tipo de reclamo inválido',
      );
    });

    it('debe fallar si validateProyecto lanza error', async () => {
      const createDto: CreateReclamoDto = {
        tipoReclamoId: 'tr-001',
        descripcion: 'Test',
        prioridad: Medidas.ALTA,
        criticidad: Medidas.MEDIA,
        areaId: 'area-001',
        proyectoId: 'invalid',
      };
      const userId = 'cli-001';

      mockValidator.validateTipoReclamo.mockResolvedValue(true);
      mockValidator.validateProyecto.mockRejectedValue(
        new Error('Proyecto inválido'),
      );

      await expect(service.create(createDto, userId)).rejects.toThrow(
        'Proyecto inválido',
      );
    });
  });

  describe('findByCliente', () => {
    it('debe devolver array de ReclamoDto para un cliente', async () => {
      const clienteId = 'cli-001';
      const reclamos = [mockReclamoEntity];

      mockReclamoRepository.findByCliente.mockResolvedValue(reclamos);

      const result = await service.findByCliente(clienteId);

      expect(mockReclamoRepository.findByCliente).toHaveBeenCalledWith(
        clienteId,
      );
      expect(result).toEqual(reclamos.map(toReclamoDto));
    });

    it('debe devolver array vacío si no hay reclamos', async () => {
      const clienteId = 'cli-999';

      mockReclamoRepository.findByCliente.mockResolvedValue([]);

      const result = await service.findByCliente(clienteId);

      expect(result).toEqual([]);
    });
  });

  describe('updateEstado', () => {
    it('debe actualizar el estado del reclamo correctamente', async () => {
      const id = 'rec-123';
      const dto: UpdateEstadoDto = {
        estado: Estados.EN_PROCESO,
        descripcion: 'Estado actualizado por empleado',
      };
      const userId = 'emp-001';

      mockValidator.validateReclamo.mockResolvedValue(true);
      mockHelper.findLastCambioEstado.mockResolvedValue(mockCambioEstadoEntity);
      mockValidator.validateCambioEstadoEmpleado.mockReturnValue(true);

      const expectedData: CambioEstadoCreateData = toCambioEstadoData(
        mockCambioEstadoEntity,
        dto,
        userId,
      );

      mockReclamoRepository.updateEstado.mockResolvedValue(mockReclamoEntity);

      const result = await service.updateEstado(id, dto, userId);

      expect(mockValidator.validateReclamo).toHaveBeenCalledWith(id);
      expect(mockHelper.findLastCambioEstado).toHaveBeenCalledWith(id);
      expect(mockValidator.validateCambioEstadoEmpleado).toHaveBeenCalledWith(
        mockCambioEstadoEntity.estado,
        dto.estado,
      );
      expect(mockReclamoRepository.updateEstado).toHaveBeenCalledWith(id, expectedData);
      expect(result).toEqual(mockReclamoEntity);
    });

    it('debe fallar si validateReclamo lanza error', async () => {
      const id = 'invalid';
      const dto: UpdateEstadoDto = { estado: Estados.EN_PROCESO };
      const userId = 'emp-001';

      mockValidator.validateReclamo.mockRejectedValue(new Error('Reclamo no existe'));

      await expect(service.updateEstado(id, dto, userId)).rejects.toThrow('Reclamo no existe');
    });

    it('debe fallar si validateCambioEstadoEmpleado lanza error (estado igual)', async () => {
      const id = 'rec-123';
      const dto: UpdateEstadoDto = { estado: Estados.PENDIENTE }; // Mismo que actual
      const userId = 'emp-001';

      mockValidator.validateReclamo.mockResolvedValue(true);
      mockHelper.findLastCambioEstado.mockResolvedValue(mockCambioEstadoEntity);
      mockValidator.validateCambioEstadoEmpleado.mockImplementation(() => {
        throw new Error('El estado actual es el mismo que el nuevo');
      });

      await expect(service.updateEstado(id, dto, userId)).rejects.toThrow(
        'El estado actual es el mismo que el nuevo',
      );
    });
  });

  describe('reassignArea', () => {
    it('debe reasignar el área del reclamo correctamente', async () => {
      const id = 'rec-123';
      const dto: ReasignarAreaDto = {
        areaId: 'area-002',
        descripcion: 'Reasignación solicitada por cliente',
      };
      const userId = 'cli-001';

      mockValidator.validateReclamo.mockResolvedValue(true);
      mockValidator.validateArea.mockResolvedValue(true);
      mockHelper.findLastCambioEstado.mockResolvedValue(mockCambioEstadoEntity);
      mockValidator.validateCambioEstadoCliente.mockReturnValue(undefined); // No error

      const expectedData: CambioEstadoCreateData = toCambioEstadoClienteData(
        mockCambioEstadoEntity,
        dto,
        userId,
      );

      mockReclamoRepository.reassignArea.mockResolvedValue(mockReclamoEntity);

      const result = await service.reassignArea(id, dto, userId);

      expect(mockValidator.validateReclamo).toHaveBeenCalledWith(id);
      expect(mockValidator.validateArea).toHaveBeenCalledWith(dto.areaId);
      expect(mockHelper.findLastCambioEstado).toHaveBeenCalledWith(id);
      expect(mockValidator.validateCambioEstadoCliente).toHaveBeenCalledWith(
        mockCambioEstadoEntity.estado,
      );
      expect(mockReclamoRepository.reassignArea).toHaveBeenCalledWith(expectedData);
      expect(result).toEqual(mockReclamoEntity);
    });

    it('debe fallar si validateArea lanza error', async () => {
      const id = 'rec-123';
      const dto: ReasignarAreaDto = { areaId: 'invalid', descripcion: 'Test' };
      const userId = 'cli-001';

      mockValidator.validateReclamo.mockResolvedValue(true);
      mockValidator.validateArea.mockRejectedValue(new Error('Área no existe'));

      await expect(service.reassignArea(id, dto, userId)).rejects.toThrow('Área no existe');
    });

    it('debe fallar si validateCambioEstadoCliente lanza error (resuelto)', async () => {
      const id = 'rec-123';
      const dto: ReasignarAreaDto = { areaId: 'area-002', descripcion: 'Test' };
      const userId = 'cli-001';

      const mockResueltoCambio: CambioEstado = {
        ...mockCambioEstadoEntity,
        estado: Estados.RESUELTO,
      };

      mockValidator.validateReclamo.mockResolvedValue(true);
      mockValidator.validateArea.mockResolvedValue(true);
      mockHelper.findLastCambioEstado.mockResolvedValue(mockResueltoCambio);
      mockValidator.validateCambioEstadoCliente.mockImplementation(() => {
        throw new Error('No se puede reasignar el área de un reclamo resuelto');
      });

      await expect(service.reassignArea(id, dto, userId)).rejects.toThrow(
        'No se puede reasignar el área de un reclamo resuelto',
      );
    });
  });
});
