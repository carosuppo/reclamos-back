import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { UpdateEmpleadoDto } from './dto/update.empleado.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { BadRequestException } from '@nestjs/common';

type MockAuthenticatedRequest = {
  user: {
    id: string;
    role: string;
  };
};

describe('EmpleadoController', () => {
  let controller: EmpleadoController;
  let mockEmpleadoService: Partial<EmpleadoService>;

  const mockUpdatedEmpleado = {
    id: 'emp-456',
    email: 'nuevo@empresa.com',
    nombre: 'Ana Actualizada',
    telefono: '351888777',
    role: 'EMPLEADO',
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    areaId: null,
  };

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
      // Sobrescribimos los guards para que siempre permitan el acceso en tests unitarios
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

  describe('PUT /empleado/update', () => {
    it('debe actualizar el perfil del empleado autenticado y devolver los datos actualizados', async () => {
      const updateDto: UpdateEmpleadoDto = {
        nombre: 'Ana Actualizada',
        telefono: '351888777',
        email: 'nuevo@empresa.com',
      };

      const mockRequest: MockAuthenticatedRequest = {
        user: {
          id: 'emp-456',
          role: 'EMPLEADO',
        },
      };

      (mockEmpleadoService.update as jest.Mock).mockResolvedValue(
        mockUpdatedEmpleado,
      );

      const result = await controller.updateProfile(
        updateDto,
        mockRequest as any,
      );

      // Verifica que llama al service con el ID del usuario autenticado
      expect(mockEmpleadoService.update).toHaveBeenCalledWith(
        'emp-456',
        updateDto,
      );

      // Verifica que devuelve lo que retorna el service
      expect(result).toEqual(mockUpdatedEmpleado);
    });

    it('debe propagar BadRequestException si el email ya está en uso', async () => {
      const updateDto: UpdateEmpleadoDto = {
        email: 'duplicado@empresa.com',
      };

      const mockRequest: MockAuthenticatedRequest = {
        user: { id: 'emp-456', role: 'EMPLEADO' },
      };

      (mockEmpleadoService.update as jest.Mock).mockRejectedValue(
        new BadRequestException('El email ya está en uso.'),
      );

      await expect(
        controller.updateProfile(updateDto, mockRequest as any),
      ).rejects.toThrow(BadRequestException);

      await expect(
        controller.updateProfile(updateDto, mockRequest as any),
      ).rejects.toThrow('El email ya está en uso.');
    });

    it('debe propagar cualquier otro error lanzado por el service', async () => {
      const updateDto: UpdateEmpleadoDto = { nombre: 'Falla' };

      const mockRequest: MockAuthenticatedRequest = {
        user: { id: 'emp-456', role: 'EMPLEADO' },
      };

      (mockEmpleadoService.update as jest.Mock).mockRejectedValue(
        new Error('Error inesperado en la base de datos'),
      );

      await expect(
        controller.updateProfile(updateDto, mockRequest as any),
      ).rejects.toThrow('Error inesperado en la base de datos');
    });
  });
});
