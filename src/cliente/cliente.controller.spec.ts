import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { UpdateClienteDto } from './dtos/update.cliente.dto';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';

describe('ClienteController', () => {
  let controller: ClienteController;
  let service: jest.Mocked<ClienteService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClienteController],
      providers: [
        {
          provide: ClienteService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClienteController>(ClienteController);
    service = module.get(ClienteService);
  });

  it('debe llamar al service.update con el id del usuario del request', async () => {
    const dto: UpdateClienteDto = {
      email: 'nuevo@mail.com',
      nombre: 'Nuevo Nombre',
      telefono: '123456',
    };

    // Mock del request sin lloriqueos
    const fakeReq = {
      user: { id: 'USER123', role: 'CLIENTE' },
    } as unknown as AuthenticatedRequest;

    const updateSpy = jest.spyOn(service, 'update').mockResolvedValue({
      id: 'USER123',
      email: 'nuevo@mail.com',
      contraseña: '123',
      nombre: 'Nuevo Nombre',
      telefono: '123456',
      role: 'CLIENTE',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    const result = await controller.updateProfile(dto, fakeReq);

    expect(updateSpy).toHaveBeenCalledWith('USER123', dto);

    expect(result).toMatchObject({
      id: 'USER123',
      email: 'nuevo@mail.com',
      nombre: 'Nuevo Nombre',
      telefono: '123456',
    });
  });

  it('debe lanzar el error del service si update falla', async () => {
    const dto: UpdateClienteDto = { nombre: 'x' };
    const fakeReq = { user: { id: '77', role: 'CLIENTE' } };

    service.update.mockRejectedValue(new Error('boom'));

    await expect(
      controller.updateProfile(dto, fakeReq as AuthenticatedRequest),
    ).rejects.toThrow('boom');
  });
});
