/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CambioEstadoService } from './cambio-estado.service';
import { CreateCambioEstadoDto } from './dto/create-cambio-estado.dto';
import { CambioEstadoValidator } from './validators/cambio-estado.validator';
import { toCambioEstadoCreateData } from './mappers/toCambioEstadoEntity';
import { toCambioEstadoDto } from './mappers/toCambioEstadoDto';
import { Estados } from '@prisma/client';
import type { CambioEstado } from '@prisma/client';
import * as ToEstadoEnumModule from './mappers/toEstadoEnum';

const mockCambioEstadoEntity: CambioEstado = {
  id: 'ce-001',
  reclamoId: 'rec-123',
  areaId: 'area-001',
  fechaInicio: new Date('2025-01-01T00:00:00Z'),
  fechaFin: null,
  descripcion: 'Estado inicial',
  estado: Estados.PENDIENTE,
  empleadoId: 'emp-001',
  clienteId: null,
};

describe('CambioEstadoService', () => {
  let service: CambioEstadoService;

  const mockRepository = {
    create: jest.fn(),
    findByReclamoId: jest.fn(),
    findByEstado: jest.fn(),
  };

  const mockValidator = {
    validateArea: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CambioEstadoService,
        {
          provide: 'ICambioEstadoRepository',
          useValue: mockRepository,
        },
        {
          provide: CambioEstadoValidator,
          useValue: mockValidator,
        },
      ],
    }).compile();

    service = module.get<CambioEstadoService>(CambioEstadoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('setEstadoInicial', () => {
    it('debe crear un cambio de estado inicial correctamente', async () => {
      const dto: CreateCambioEstadoDto = {
        reclamoId: 'rec-123',
        areaId: 'area-001',
        estado: Estados.PENDIENTE,
        descripcion: 'Estado inicial del reclamo',
        empleadoId: 'emp-001',
        clienteId: undefined,
      };

      mockValidator.validateArea.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(mockCambioEstadoEntity);

      const result = await service.setEstadoInicial(dto);

      expect(mockValidator.validateArea).toHaveBeenCalledWith(dto.areaId);
      expect(mockRepository.create).toHaveBeenCalledWith(
        toCambioEstadoCreateData(dto),
      );
      expect(result).toEqual(toCambioEstadoDto(mockCambioEstadoEntity));
    });

    it('debe lanzar BadRequestException si el repository devuelve null', async () => {
      const dto: CreateCambioEstadoDto = {
        reclamoId: 'rec-123',
        areaId: 'area-001',
        estado: Estados.PENDIENTE,
        descripcion: 'Test',
        empleadoId: 'emp-001',
      };

      mockValidator.validateArea.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(null);

      await expect(service.setEstadoInicial(dto)).rejects.toThrow(BadRequestException);
      await expect(service.setEstadoInicial(dto)).rejects.toThrow('Error al crear el cambio de estado.');
    });

    it('debe fallar si validateArea lanza error', async () => {
      const dto: CreateCambioEstadoDto = {
        reclamoId: 'rec-123',
        areaId: 'invalid',
        estado: Estados.PENDIENTE,
        descripcion: 'Test',
      };

      mockValidator.validateArea.mockRejectedValue(new Error('Área no existe'));

      await expect(service.setEstadoInicial(dto)).rejects.toThrow('Área no existe');
    });
  });

  describe('setEstadoEnProceso', () => {
    it('debe crear un cambio de estado EN_PROCESO correctamente', async () => {
      const dto: CreateCambioEstadoDto = {
        reclamoId: 'rec-123',
        areaId: 'area-001',
        estado: Estados.EN_PROCESO,
        descripcion: 'Reclamo en proceso',
        empleadoId: 'emp-001',
      };

      const mockEnProcesoEntity = { ...mockCambioEstadoEntity, estado: Estados.EN_PROCESO };

      mockValidator.validateArea.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(mockEnProcesoEntity);

      const result = await service.setEstadoEnProceso(dto);

      expect(mockValidator.validateArea).toHaveBeenCalledWith(dto.areaId);
      expect(mockRepository.create).toHaveBeenCalledWith(toCambioEstadoCreateData(dto));
      expect(result).toEqual(toCambioEstadoDto(mockEnProcesoEntity));
    });
  });

  describe('setEstadoTerminado', () => {
    it('debe crear un cambio de estado TERMINADO correctamente', async () => {
      const dto: CreateCambioEstadoDto = {
        reclamoId: 'rec-123',
        areaId: 'area-001',
        estado: Estados.RESUELTO,
        descripcion: 'Reclamo resuelto',
        empleadoId: 'emp-001',
      };

      const mockTerminadoEntity = { ...mockCambioEstadoEntity, estado: Estados.RESUELTO };

      mockValidator.validateArea.mockResolvedValue(true);
      mockRepository.create.mockResolvedValue(mockTerminadoEntity);

      const result = await service.setEstadoTerminado(dto);

      expect(mockValidator.validateArea).toHaveBeenCalledWith(dto.areaId);
      expect(mockRepository.create).toHaveBeenCalledWith(toCambioEstadoCreateData(dto));
      expect(result).toEqual(toCambioEstadoDto(mockTerminadoEntity));
    });
  });

  describe('findByReclamo', () => {
    it('debe devolver array de CambioEstadoDto para un reclamo', async () => {
      const reclamoId = 'rec-123';
      const cambios = [mockCambioEstadoEntity];

      mockRepository.findByReclamoId.mockResolvedValue(cambios);

      const result = await service.findByReclamo(reclamoId);

      expect(mockRepository.findByReclamoId).toHaveBeenCalledWith(reclamoId);
      expect(result).toEqual(cambios.map(toCambioEstadoDto));
    });

    it('debe devolver array vacío si no hay cambios', async () => {
      const reclamoId = 'rec-999';

      mockRepository.findByReclamoId.mockResolvedValue([]);

      const result = await service.findByReclamo(reclamoId);

      expect(result).toEqual([]);
    });
  });

  describe('findByEstado', () => {
    it('debe devolver array de CambioEstadoDto para un estado válido', async () => {
      const estadoString = 'PENDIENTE';
      const estadoEnum = Estados.PENDIENTE;
      const cambios = [mockCambioEstadoEntity];

      // ← FIX: Spy directo en el módulo importado
      const spyToEstadoEnum = jest.spyOn(ToEstadoEnumModule, 'toEstadoEnum').mockReturnValue(estadoEnum);
      mockRepository.findByEstado.mockResolvedValue(cambios);

      const result = await service.findByEstado(estadoString);

      expect(spyToEstadoEnum).toHaveBeenCalledWith(estadoString);
      expect(mockRepository.findByEstado).toHaveBeenCalledWith(estadoEnum);
      expect(result).toEqual(cambios.map(toCambioEstadoDto));

      // Limpia el spy después (opcional, pero buena práctica)
      spyToEstadoEnum.mockRestore();
    });
  });
});