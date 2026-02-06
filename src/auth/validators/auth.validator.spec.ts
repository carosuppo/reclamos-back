import { AuthValidator } from './auth.validator';

describe('AuthValidator', () => {
  const mockClienteValidator = {
    validateByEmail: jest.fn(),
  };

  const mockEmpleadoValidator = {
    validateByEmail: jest.fn(),
  };

  const validator = new AuthValidator(
    mockClienteValidator as never,
    mockEmpleadoValidator as never,
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('valida email contra empleado y cliente', async () => {
    await validator.validateEmail('test@mail.com');

    expect(mockEmpleadoValidator.validateByEmail).toHaveBeenCalledWith(
      'test@mail.com',
    );
    expect(mockClienteValidator.validateByEmail).toHaveBeenCalledWith(
      'test@mail.com',
    );
  });
});
