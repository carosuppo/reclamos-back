import { NotFoundException } from '@nestjs/common';
import { TipoReclamoValidator } from './tipo-reclamo.validator';

describe('TipoReclamoValidator', () => {
  const mockRepository = {
    findById: jest.fn(),
  };

  const validator = new TipoReclamoValidator(mockRepository as never);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('no lanza error si no se envia id', async () => {
    await expect(validator.validateTipoReclamo()).resolves.toBeUndefined();
  });

  it('lanza NotFoundException si no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(validator.validateTipoReclamo('tr-1')).rejects.toThrow(
      NotFoundException,
    );
  });
});
