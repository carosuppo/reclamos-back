import { ClienteValidator } from './cliente.validator';

describe('ClienteValidator', () => {
  const mockRepository = {
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };

  const validator = new ClienteValidator(mockRepository as never);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('validateUpdate consulta por id y email', async () => {
    await validator.validateUpdate('cli-1', 'c@test.com');

    expect(mockRepository.findById).toHaveBeenCalledWith('cli-1');
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('c@test.com');
  });

  it('validateByEmail lanza error si existe', async () => {
    mockRepository.findByEmail.mockResolvedValue({ id: 'cli-1' });

    await expect(validator.validateByEmail('c@test.com')).rejects.toThrow(
      'Cliente con ID c@test.com ya registrado.',
    );
  });
});
