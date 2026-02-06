import { Test, TestingModule } from '@nestjs/testing';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { UpdateClienteDTO } from './dtos/update.cliente.dto';

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

  it('debe llamar al service.update con el id del usuario', async () => {
    const dto: UpdateClienteDTO = {
      email: 'nuevo@mail.com',
      nombre: 'Nuevo Nombre',
      telefono: '123456',
    };

    const updateSpy = jest.spyOn(service, 'update').mockResolvedValue(true);

    const result = await controller.updateProfile(dto, 'USER123');

    expect(updateSpy).toHaveBeenCalledWith('USER123', dto);
    expect(result).toBe(true);
  });

  it('debe propagar el error del service si update falla', async () => {
    const dto: UpdateClienteDTO = { nombre: 'x' };

    service.update.mockRejectedValue(new Error('boom'));

    await expect(controller.updateProfile(dto, '77')).rejects.toThrow('boom');
  });
});
