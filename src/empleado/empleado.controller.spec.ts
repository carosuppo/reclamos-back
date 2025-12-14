import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { UpdateEmpleadoDto } from './dtos/update.empleado.dto';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request';

describe('EmpleadoController', () => {
  let controller: EmpleadoController;
  let service: jest.Mocked<EmpleadoService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpleadoController],
      providers: [
        {
          provide: EmpleadoService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmpleadoController>(EmpleadoController);
    service = module.get(EmpleadoService);
  });

  it('debe llamar al service.update con el id del usuario del request', async () => {
    const dto: UpdateEmpleadoDto = {
      email: 'nuevo@empleado.com',
      nombre: 'Nuevo Nombre',
      telefono: '555222',
    };

    const fakeReq = {
      user: { id: 'EMP777', role: 'EMPLEADO' },
    } as AuthenticatedRequest;

    const mockResponse = {
      id: 'EMP777',
      email: 'nuevo@empleado.com',
      contraseña: 'secreta',
      nombre: 'Nuevo Nombre',
      telefono: '555222',
      role: 'EMPLEADO',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    jest.spyOn(service, 'update').mockResolvedValue(mockResponse);

    const result = await controller.updateProfile(dto, fakeReq);

    expect(service.update).toHaveBeenCalledWith('EMP777', dto);

    expect(result).toMatchObject({
      id: 'EMP777',
      email: 'nuevo@empleado.com',
      nombre: 'Nuevo Nombre',
      telefono: '555222',
    });
  });

  it('debe lanzar el error del service si update falla', async () => {
    const dto: UpdateEmpleadoDto = { nombre: 'x' };

    const fakeReq = {
      user: { id: '44' },
    } as AuthenticatedRequest;

    service.update.mockRejectedValue(new Error('boom'));

    await expect(controller.updateProfile(dto, fakeReq)).rejects.toThrow('boom');
  });
});
