import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CambioEstadoValidator } from './cambio-estado.validator';
import { AreaService } from 'src/area/area.service';

describe('CambioEstadoValidator', () => {
  let validator: CambioEstadoValidator;

  const mockAreaService: jest.Mocked<AreaService> = {
    findOne: jest.fn(),
  } as unknown as jest.Mocked<AreaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CambioEstadoValidator,
        {
          provide: AreaService,
          useValue: mockAreaService,
        },
      ],
    }).compile();

    validator = module.get<CambioEstadoValidator>(CambioEstadoValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ===============================
        validateArea
     =============================== */

  describe('validateArea', () => {
    it('returns true when area exists', async () => {
      const areaId = 'area-1';

      const findOneSpy = jest
        .spyOn(mockAreaService, 'findOne')
        .mockResolvedValue({ id: areaId } as never);

      const result = await validator.validateArea(areaId);

      expect(findOneSpy).toHaveBeenCalledWith(areaId);
      expect(result).toBe(true);
    });

    it('throws BadRequestException when area does not exist', async () => {
      const areaId = 'area-inexistente';

      jest.spyOn(mockAreaService, 'findOne').mockResolvedValue(null as never);

      await expect(validator.validateArea(areaId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
