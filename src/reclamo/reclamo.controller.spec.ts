import { Test, TestingModule } from '@nestjs/testing';
import { ReclamoController } from './reclamo.controller';
import { ReclamoService } from './reclamo.service';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { BadRequestException } from '@nestjs/common';

describe('ReclamoController', () => {
  let controller: ReclamoController;
  let service: ReclamoService;

  const mockReqCliente = {
    user: {
      id: 'user-1',
      role: 'CLIENTE',
    },
  };

  const mockReqEmpleado = {
    user: {
      id: 'user-2',
      role: 'EMPLEADO',
    },
  };

  const mockReclamoDto = {
    id: 'rec-1',
    titulo: 'Reclamo test',
    descripcion: 'Descripción',
    estado: 'PENDIENTE',
  };

  const mockService = {
    create: jest.fn(),
    findByCliente: jest.fn(),
    findByArea: jest.fn(),
    updateEstado: jest.fn(),
    reassignArea: jest.fn(),
    update: jest.fn(),
    findByFiltros: jest.fn(),
    getTiempoPromedioResolucion: jest.fn(),
    getCantidadPromedioResolucion: jest.fn(),
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

  /* ======================
        CREATE
     ====================== */
  it('crea un reclamo', async () => {
    const dto = { tipoReclamoId: 'tr-1', proyectoId: 'p-1' };

    const createSpy = jest
      .spyOn(service, 'create')
      .mockResolvedValue(mockReclamoDto as never);

    const result = await controller.create(dto as never, mockReqCliente);

    expect(createSpy).toHaveBeenCalledWith(dto, 'user-1');
    expect(result).toEqual(mockReclamoDto);
  });

  it('propaga error al crear reclamo', async () => {
    jest.spyOn(service, 'create').mockRejectedValue(new BadRequestException());

    await expect(
      controller.create({} as never, mockReqCliente),
    ).rejects.toThrow(BadRequestException);
  });

  /* ======================
        FIND BY CLIENTE
     ====================== */
  it('obtiene reclamos por cliente', async () => {
    const findSpy = jest
      .spyOn(service, 'findByCliente')
      .mockResolvedValue([mockReclamoDto] as never);

    const result = await controller.findByCliente(mockReqEmpleado);

    expect(findSpy).toHaveBeenCalledWith('user-2');
    expect(result).toHaveLength(1);
  });

  /* ======================
        FIND BY AREA
     ====================== */
  it('obtiene reclamos por área', async () => {
    const findSpy = jest
      .spyOn(service, 'findByArea')
      .mockResolvedValue([mockReclamoDto] as never);

    const result = await controller.findByArea(mockReqEmpleado);

    expect(findSpy).toHaveBeenCalledWith('user-2');
    expect(result).toHaveLength(1);
  });

  /* ======================
        UPDATE ESTADO
     ====================== */
  it('actualiza el estado del reclamo', async () => {
    const dto = { estado: 'RESUELTO' };

    const updateEstadoSpy = jest
      .spyOn(service, 'updateEstado')
      .mockResolvedValue(mockReclamoDto as never);

    const result = await controller.updateEstado(
      'rec-1',
      dto as never,
      mockReqEmpleado,
    );

    expect(updateEstadoSpy).toHaveBeenCalledWith('rec-1', dto, 'user-2');
    expect(result).toEqual(mockReclamoDto);
  });

  /* ======================
        REASSIGN AREA
     ====================== */
  it('reasigna el área', async () => {
    const dto = { areaId: 'area-1' };

    const reassignSpy = jest
      .spyOn(service, 'reassignArea')
      .mockResolvedValue(mockReclamoDto as never);

    const result = await controller.reassignArea(
      'rec-1',
      dto as never,
      mockReqEmpleado,
    );

    expect(reassignSpy).toHaveBeenCalledWith('rec-1', dto, 'user-2');
    expect(result).toEqual(mockReclamoDto);
  });

  /* ======================
        UPDATE
     ====================== */
  it('actualiza un reclamo', async () => {
    const dto = { descripcion: 'Nueva descripción' };

    const updateSpy = jest
      .spyOn(service, 'update')
      .mockResolvedValue(mockReclamoDto as never);

    const result = await controller.update(
      'rec-1',
      dto as never,
      mockReqCliente,
    );

    expect(updateSpy).toHaveBeenCalledWith('rec-1', dto, 'user-1');
    expect(result).toEqual(mockReclamoDto);
  });

  /* ======================
        FILTROS
     ====================== */
  it('obtiene reclamos por filtros', async () => {
    const filtros = { estado: 'PENDIENTE' };

    const filtrosSpy = jest
      .spyOn(service, 'findByFiltros')
      .mockResolvedValue([mockReclamoDto] as never);

    const result = await controller.findByFiltros(filtros as never);

    expect(filtrosSpy).toHaveBeenCalledWith(filtros);
    expect(result).toHaveLength(1);
  });

  /* ======================
        MÉTRICAS
     ====================== */
  it('obtiene tiempo promedio de resolución', async () => {
    const tiempoSpy = jest
      .spyOn(service, 'getTiempoPromedioResolucion')
      .mockResolvedValue(4.2);

    const result = await controller.getTiempoPromedioResolucion('area-1');

    expect(tiempoSpy).toHaveBeenCalledWith('area-1');
    expect(result).toBe(4.2);
  });

  it('obtiene cantidad promedio de resolución', async () => {
    const cantidadSpy = jest
      .spyOn(service, 'getCantidadPromedioResolucion')
      .mockResolvedValue(0.9);

    const result = await controller.getCantidadPromedioResolucion('area-1');

    expect(cantidadSpy).toHaveBeenCalledWith('area-1');
    expect(result).toBe(0.9);
  });
});
