import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Estados } from '@prisma/client';
import { Medidas } from '../common/enums/medidas.enum';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ReclamoController } from './reclamo.controller';
import { ReclamoService } from './reclamo.service';

describe('ReclamoController', () => {
  let controller: ReclamoController;
  let service: ReclamoService;

  const mockReclamoDto = {
    id: 'rec-1',
    tipoReclamo: 'tr-1',
    proyecto: 'proy-1',
    prioridad: Medidas.ALTA,
    criticidad: Medidas.MEDIA,
    descripcion: 'Descripcion',
    estado: Estados.PENDIENTE,
  };

  const mockService = {
    create: jest.fn(),
    changeEstado: jest.fn(),
    reassignArea: jest.fn(),
    update: jest.fn(),
    findByCliente: jest.fn(),
    findByArea: jest.fn(),
    findById: jest.fn(),
    countByFiltros: jest.fn(),
    getTiemProm: jest.fn(),
    getCantProm: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReclamoController],
      providers: [
        {
          provide: ReclamoService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ReclamoController>(ReclamoController);
    service = module.get<ReclamoService>(ReclamoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('controller definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('crea un reclamo', async () => {
      const dto = {
        tipoReclamoId: 'tr-1',
        proyectoId: 'p-1',
        areaId: 'a-1',
        prioridad: Medidas.ALTA,
        criticidad: Medidas.MEDIA,
        descripcion: 'Desc',
      };

      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValue(mockReclamoDto as never);

      const result = await controller.create(dto as never, 'user-1');

      expect(createSpy).toHaveBeenCalledWith(dto, 'user-1');
      expect(result).toEqual(mockReclamoDto);
    });

    it('propaga error al crear reclamo', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadRequestException());

      await expect(controller.create({} as never, 'user-1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByCliente', () => {
    it('obtiene reclamos por cliente', async () => {
      const findSpy = jest
        .spyOn(service, 'findByCliente')
        .mockResolvedValue([mockReclamoDto] as never);

      const result = await controller.findByCliente('user-1');

      expect(findSpy).toHaveBeenCalledWith('user-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('findByArea', () => {
    it('obtiene reclamos por area', async () => {
      const findSpy = jest
        .spyOn(service, 'findByArea')
        .mockResolvedValue([mockReclamoDto] as never);

      const result = await controller.findByArea('user-2');

      expect(findSpy).toHaveBeenCalledWith('user-2');
      expect(result).toHaveLength(1);
    });
  });

  describe('findById', () => {
    it('obtiene reclamo por id', async () => {
      const findSpy = jest
        .spyOn(service, 'findById')
        .mockResolvedValue(mockReclamoDto as never);

      const result = await controller.findById('rec-1');

      expect(findSpy).toHaveBeenCalledWith('rec-1');
      expect(result).toEqual(mockReclamoDto);
    });
  });

  describe('changeEstado', () => {
    it('actualiza el estado del reclamo', async () => {
      const dto = { estado: Estados.RESUELTO, descripcion: 'Resuelto' };

      const changeSpy = jest
        .spyOn(service, 'changeEstado')
        .mockResolvedValue(mockReclamoDto as never);

      const result = await controller.changeEstado(
        'rec-1',
        dto as never,
        'user-2',
      );

      expect(changeSpy).toHaveBeenCalledWith('rec-1', dto, 'user-2');
      expect(result).toEqual(mockReclamoDto);
    });
  });

  describe('reassignArea', () => {
    it('reasigna el area', async () => {
      const dto = { areaId: 'area-1', descripcion: 'Reasignado' };

      const reassignSpy = jest
        .spyOn(service, 'reassignArea')
        .mockResolvedValue(mockReclamoDto as never);

      const result = await controller.reassignArea(
        'rec-1',
        dto as never,
        'user-2',
      );

      expect(reassignSpy).toHaveBeenCalledWith('rec-1', dto, 'user-2');
      expect(result).toEqual(mockReclamoDto);
    });
  });

  describe('update', () => {
    it('actualiza un reclamo', async () => {
      const dto = { descripcion: 'Nueva descripcion' };

      const updateSpy = jest
        .spyOn(service, 'update')
        .mockResolvedValue(mockReclamoDto as never);

      const result = await controller.update('rec-1', dto as never, 'user-1');

      expect(updateSpy).toHaveBeenCalledWith('rec-1', dto, 'user-1');
      expect(result).toEqual(mockReclamoDto);
    });
  });

  describe('countByFiltros', () => {
    it('obtiene cantidad por filtros', async () => {
      const filtros = { estado: Estados.PENDIENTE };

      const filtrosSpy = jest
        .spyOn(service, 'countByFiltros')
        .mockResolvedValue(2 as never);

      const result = await controller.countByFiltros(filtros as never);

      expect(filtrosSpy).toHaveBeenCalledWith(filtros);
      expect(result).toBe(2);
    });
  });

  describe('metricas', () => {
    it('obtiene tiempo promedio de resolucion', async () => {
      const tiempoSpy = jest
        .spyOn(service, 'getTiemProm')
        .mockResolvedValue(4.2 as never);

      const result = await controller.getTiemProm('area-1');

      expect(tiempoSpy).toHaveBeenCalledWith('area-1');
      expect(result).toBe(4.2);
    });

    it('obtiene cantidad promedio de resolucion', async () => {
      const cantidadSpy = jest
        .spyOn(service, 'getCantProm')
        .mockResolvedValue(0.9 as never);

      const result = await controller.getCantProm('area-1');

      expect(cantidadSpy).toHaveBeenCalledWith('area-1');
      expect(result).toBe(0.9);
    });
  });
});
