import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CambioEstadoService } from './cambio-estado.service';
import { CambioEstadoValidator } from './validators/cambio-estado.validator';
import { Estados, CambioEstado } from '@prisma/client';
import type { ICambioEstadoRepository } from './repositories/cambio-estado.repository.interface';
import type { CreateCambioEstadoDto } from './dto/create-cambio-estado.dto';

describe('CambioEstadoService', () => {
  let service: CambioEstadoService;

  const mockRepository: jest.Mocked<ICambioEstadoRepository> = {
    create: jest.fn(),
    close: jest.fn(),
    findByReclamoId: jest.fn(),
    findByEstado: jest.fn(),
    findLastCambioEstado: jest.fn(),
  };

  const mockValidator: jest.Mocked<CambioEstadoValidator> = {
    validate: jest.fn(),
  } as unknown as jest.Mocked<CambioEstadoValidator>;

  const createDto: CreateCambioEstadoDto = {
    reclamoId: 'reclamo-1',
    estado: Estados.PENDIENTE,
    clienteId: 'cliente-1',
    descripcion: 'Descripción del cambio de estado',
    areaId: 'area-1',
  };

  const cambioEstadoEntity: CambioEstado = {
    id: 'ce-1',
    reclamoId: 'reclamo-1',
    estado: Estados.PENDIENTE,
    fechaInicio: new Date(),
    fechaFin: null,
    clienteId: 'cliente-1',
    empleadoId: null,
    descripcion: 'Descripción del cambio de estado',
    areaId: 'area-1',
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

  /* ===============================
        setEstadoInicial
     =============================== */

  describe('setEstadoInicial', () => {
    it('crea correctamente el estado inicial', async () => {
      const createSpy = jest
        .spyOn(mockRepository, 'create')
        .mockResolvedValue(cambioEstadoEntity);

      const result = await service.setEstadoInicial(createDto);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result.estado).toBe(Estados.PENDIENTE);
    });

    it('lanza BadRequestException si la creación falla', async () => {
      jest
        .spyOn(mockRepository, 'create')
        .mockResolvedValue(null as unknown as CambioEstado);

      await expect(service.setEstadoInicial(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /* ===============================
        setEstadoEnProceso
     =============================== */

  describe('setEstadoEnProceso', () => {
    it('crea correctamente el estado EN_PROCESO', async () => {
      const createSpy = jest.spyOn(mockRepository, 'create').mockResolvedValue({
        ...cambioEstadoEntity,
        estado: Estados.EN_PROCESO,
      });

      const result = await service.setEstadoEnProceso(createDto);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result.estado).toBe(Estados.EN_PROCESO);
    });

    it('lanza BadRequestException si falla la creación', async () => {
      jest
        .spyOn(mockRepository, 'create')
        .mockResolvedValue(null as unknown as CambioEstado);

      await expect(service.setEstadoEnProceso(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /* ===============================
        setEstadoTerminado
     =============================== */

  describe('setEstadoTerminado', () => {
    it('crea correctamente el estado RESUELTO', async () => {
      const createSpy = jest.spyOn(mockRepository, 'create').mockResolvedValue({
        ...cambioEstadoEntity,
        estado: Estados.RESUELTO,
      });

      const result = await service.setEstadoTerminado(createDto);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(result.estado).toBe(Estados.RESUELTO);
    });

    it('lanza BadRequestException si falla la creación', async () => {
      jest
        .spyOn(mockRepository, 'create')
        .mockResolvedValue(null as unknown as CambioEstado);

      await expect(service.setEstadoTerminado(createDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  /* ===============================
        findByReclamo
     =============================== */

  describe('findByReclamo', () => {
    it('devuelve los cambios de estado de un reclamo', async () => {
      const findByReclamoSpy = jest
        .spyOn(mockRepository, 'findByReclamoId')
        .mockResolvedValue([cambioEstadoEntity]);

      const result = await service.findByReclamo('reclamo-1');

      expect(findByReclamoSpy).toHaveBeenCalledWith('reclamo-1');
      expect(result).toHaveLength(1);
    });
  });

  /* ===============================
        findByEstado
     =============================== */

  describe('findByEstado', () => {
    it('devuelve los cambios de estado filtrados por estado', async () => {
      const findByEstadoSpy = jest
        .spyOn(mockRepository, 'findByEstado')
        .mockResolvedValue([cambioEstadoEntity]);

      const result = await service.findByEstado('pendiente');

      expect(findByEstadoSpy).toHaveBeenCalledWith(Estados.PENDIENTE);
      expect(result).toHaveLength(1);
    });
  });
});
