import { Estados } from '@prisma/client';
import { ReclamoValidator } from './reclamo.validator';

describe('ReclamoValidator', () => {
  const mockTipoReclamoService = { findById: jest.fn() };
  const mockProyectoService = { findById: jest.fn() };
  const mockAreaService = { findById: jest.fn() };
  const mockClienteService = { findById: jest.fn() };
  const mockRepository = { findById: jest.fn() };

  const validator = new ReclamoValidator(
    mockTipoReclamoService as never,
    mockProyectoService as never,
    mockAreaService as never,
    mockClienteService as never,
    mockRepository as never,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateTipoReclamo', () => {
    it('no lanza error si existe', async () => {
      mockTipoReclamoService.findById.mockResolvedValue({ id: 'tr-1' });
      await expect(
        validator.validateTipoReclamo('tr-1'),
      ).resolves.toBeUndefined();
    });

    it('lanza error si no existe', async () => {
      mockTipoReclamoService.findById.mockResolvedValue(null);
      await expect(validator.validateTipoReclamo('tr-1')).rejects.toThrow(
        'El tipo de reclamo con id tr-1 no existe',
      );
    });
  });

  describe('validateProyecto', () => {
    it('no lanza error si existe', async () => {
      mockProyectoService.findById.mockResolvedValue({ id: 'p-1' });
      await expect(validator.validateProyecto('p-1')).resolves.toBeUndefined();
    });

    it('lanza error si no existe', async () => {
      mockProyectoService.findById.mockResolvedValue(null);
      await expect(validator.validateProyecto('p-1')).rejects.toThrow(
        'El proyecto con id p-1 no existe',
      );
    });
  });

  describe('validateReclamo', () => {
    it('no lanza error si existe', async () => {
      mockRepository.findById.mockResolvedValue({ id: 'rec-1' });
      await expect(validator.validateReclamo('rec-1')).resolves.toBeUndefined();
    });

    it('lanza error si no existe', async () => {
      mockRepository.findById.mockResolvedValue(null);
      await expect(validator.validateReclamo('rec-1')).rejects.toThrow(
        'El reclamo con id rec-1 no existe',
      );
    });
  });

  describe('validateArea', () => {
    it('no lanza error si existe', async () => {
      mockAreaService.findById.mockResolvedValue({ id: 'area-1' });
      await expect(validator.validateArea('area-1')).resolves.toBeUndefined();
    });

    it('lanza error si no existe', async () => {
      mockAreaService.findById.mockResolvedValue(null);
      await expect(validator.validateArea('area-1')).rejects.toThrow(/El .*rea con id area-1 no existe/);
    });
  });

  describe('validateCliente', () => {
    it('no lanza error si existe', async () => {
      mockClienteService.findById.mockResolvedValue({ id: 'cli-1' });
      await expect(validator.validateCliente('cli-1')).resolves.toBeUndefined();
    });

    it('lanza error si no existe', async () => {
      mockClienteService.findById.mockResolvedValue(null);
      await expect(validator.validateCliente('cli-1')).rejects.toThrow(
        'El cliente con id cli-1 no existe',
      );
    });
  });

  describe('validateCambioEstado', () => {
    it('lanza error si el estado actual es RESUELTO', () => {
      expect(() => validator.validateCambioEstado(Estados.RESUELTO)).toThrow(
        'No se puede actualizar un reclamo resuelto',
      );
    });

    it('lanza error si el estado nuevo es el mismo', () => {
      expect(() =>
        validator.validateCambioEstado(Estados.PENDIENTE, Estados.PENDIENTE),
      ).toThrow('El estado actual no puede ser el nuevo estado');
    });

    it('lanza error si el estado nuevo pasa a PENDIENTE', () => {
      expect(() =>
        validator.validateCambioEstado(Estados.EN_PROCESO, Estados.PENDIENTE),
      ).toThrow('El estado nuevo no puede pasar a pendiente');
    });

    it('no lanza error si el cambio es valido', () => {
      expect(() =>
        validator.validateCambioEstado(Estados.PENDIENTE, Estados.EN_PROCESO),
      ).not.toThrow();
    });
  });

  describe('validateCreate', () => {
    it('valida tipo de reclamo, proyecto y area', async () => {
      const tipoSpy = jest
        .spyOn(validator, 'validateTipoReclamo')
        .mockResolvedValue(undefined);
      const proyectoSpy = jest
        .spyOn(validator, 'validateProyecto')
        .mockResolvedValue(undefined);
      const areaSpy = jest
        .spyOn(validator, 'validateArea')
        .mockResolvedValue(undefined);

      await validator.validateCreate('tr-1', 'p-1', 'area-1');

      expect(tipoSpy).toHaveBeenCalledWith('tr-1');
      expect(proyectoSpy).toHaveBeenCalledWith('p-1');
      expect(areaSpy).toHaveBeenCalledWith('area-1');
    });
  });

  describe('validateReassignArea', () => {
    it('valida reclamo y area', async () => {
      const reclamoSpy = jest
        .spyOn(validator, 'validateReclamo')
        .mockResolvedValue(undefined);
      const areaSpy = jest
        .spyOn(validator, 'validateArea')
        .mockResolvedValue(undefined);

      await validator.validateReassignArea('rec-1', 'area-1');

      expect(reclamoSpy).toHaveBeenCalledWith('rec-1');
      expect(areaSpy).toHaveBeenCalledWith('area-1');
    });
  });
});



