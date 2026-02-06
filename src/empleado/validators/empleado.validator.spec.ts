import { EmpleadoValidator } from './empleado.validator';

describe('EmpleadoValidator', () => {
  const mockRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const validator = new EmpleadoValidator(mockRepository as never);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validate lanza error si no existe', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(validator.validate('emp-1')).rejects.toThrow(
      'Empleado con ID emp-1 no encontrado.',
    );
  });

  it('validateByEmail lanza error si existe', async () => {
    mockRepository.findByEmail.mockResolvedValue({ id: 'emp-1' });

    await expect(validator.validateByEmail('e@test.com')).rejects.toThrow(
      'Empleado con email e@test.com ya registrado.',
    );
  });
});
