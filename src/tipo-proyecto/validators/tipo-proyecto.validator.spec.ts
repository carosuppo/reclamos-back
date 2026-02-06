import { NotFoundException } from '@nestjs/common';
import { TipoProyectoValidator } from './tipo-proyecto.validator';

describe('TipoProyectoValidator', () => {
  const mockRepository = {
    findById: jest.fn(),
  };

  const validator = new TipoProyectoValidator(mockRepository as never);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('no lanza error si no se envia id', async () => {
    await expect(validator.validateTipoProyecto()).resolves.toBeUndefined();
  });

  it('lanza NotFoundException si no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(validator.validateTipoProyecto('tp-1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
