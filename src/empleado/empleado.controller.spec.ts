import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { UpdateEmpleadoDTO } from './dtos/update-empleado.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BadRequestException } from '@nestjs/common';

describe('EmpleadoController', () => {
  let controller: EmpleadoController;
  let mockEmpleadoService: Partial<EmpleadoService>;

  beforeEach(async () => {
    mockEmpleadoService = {
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmpleadoController],
      providers: [
        {
          provide: EmpleadoService,
          useValue: mockEmpleadoService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EmpleadoController>(EmpleadoController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('PATCH /empleado', () => {
    it('debe actualizar el perfil del empleado autenticado', async () => {
      const updateDto: UpdateEmpleadoDTO = {
        nombre: 'Ana Actualizada',
        telefono: '351888777',
        email: 'nuevo@empresa.com',
      };

      (mockEmpleadoService.update as jest.Mock).mockResolvedValue(true);

      const result = await controller.updateProfile(updateDto, 'emp-456');

      expect(mockEmpleadoService.update).toHaveBeenCalledWith(
        'emp-456',
        updateDto,
      );
      expect(result).toBe(true);
    });

    it('debe propagar BadRequestException si el email ya esta en uso', async () => {
      const updateDto: UpdateEmpleadoDTO = {
        email: 'duplicado@empresa.com',
      };

      (mockEmpleadoService.update as jest.Mock).mockRejectedValue(
        new BadRequestException('El email ya esta en uso.'),
      );

      await expect(
        controller.updateProfile(updateDto, 'emp-456'),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe propagar cualquier otro error lanzado por el service', async () => {
      const updateDto: UpdateEmpleadoDTO = { nombre: 'Falla' };

      (mockEmpleadoService.update as jest.Mock).mockRejectedValue(
        new Error('Error inesperado en la base de datos'),
      );

      await expect(
        controller.updateProfile(updateDto, 'emp-456'),
      ).rejects.toThrow('Error inesperado en la base de datos');
    });
  });
});
