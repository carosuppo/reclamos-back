import { Test, TestingModule } from '@nestjs/testing';
import { EmpleadoService } from './empleado.service';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UpdateEmpleadoDto } from './dtos/update.empleado.dto';
import { AuthMapper } from 'src/common/mappers/toAuthDto.mapper';
import { Role } from 'src/common/enums/role.enum';
import { toEmpleadoDto } from './mappers/toEmpleadoDto.mapper';
import { toEmpleadoEntity } from './mappers/toEmpleadoEntity.mapper';
import { toEmpleadoUpdateData } from './mappers/toEmpleadoParcial.mapper';
import { BadRequestException } from '@nestjs/common';

const mockEmpleadoEntity = {
  id: 'emp-456',
  email: 'empleado@test.com',
  contraseña: 'hashed456',
  nombre: 'Ana Gómez',
  telefono: '3519876543',
  role: Role.EMPLEADO,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-02'),
  deletedAt: null,
  areaId: null,
};

describe('EmpleadoService', () => {
  let service: EmpleadoService;

  const mockEmpleadoRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpleadoService,
        {
          provide: 'IEmpleadoRepository',
          useValue: mockEmpleadoRepository,
        },
      ],
    }).compile();

    service = module.get<EmpleadoService>(EmpleadoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('debe registrar un empleado correctamente y devolver EmpleadoDto', async () => {
      const registerDto: RegisterDto = {
        email: 'empleado@test.com',
        contraseña: 'pass456',
        nombre: 'Ana Gómez',
        telefono: '3519876543',
      };

      mockEmpleadoRepository.create.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.register(registerDto);

      expect(mockEmpleadoRepository.create).toHaveBeenCalledWith(
        toEmpleadoEntity(registerDto),
      );
      expect(result).toEqual(toEmpleadoDto(mockEmpleadoEntity));
    });

    it('debe lanzar un Error genérico si el repository falla', async () => {
      const registerDto: RegisterDto = {
        email: 'error@empleado.com',
        contraseña: 'pass',
        nombre: 'Error',
        telefono: '000',
      };

      mockEmpleadoRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.register(registerDto)).rejects.toThrow(
        'Error al crear el empleado: DB error',
      );
    });
  });

  describe('findOne', () => {
    it('debe devolver EmpleadoDto si el empleado existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.findOne('empleado@test.com');

      expect(result).toEqual(toEmpleadoDto(mockEmpleadoEntity));
    });

    it('debe devolver null si el empleado no existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findOne('noexiste@empleado.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('debe actualizar el empleado correctamente', async () => {
      const existingEmpleado = { ...mockEmpleadoEntity, id: 'emp-456' };
      const updateDto: UpdateEmpleadoDto = {
        nombre: 'Ana Actualizada',
        telefono: '351111222',
      };

      mockEmpleadoRepository.findById.mockResolvedValue(existingEmpleado);
      mockEmpleadoRepository.findByEmail.mockResolvedValue(null); // sin conflicto de email
      mockEmpleadoRepository.update.mockResolvedValue({
        ...existingEmpleado,
        ...updateDto,
      });

      const result = await service.update('emp-456', updateDto);

      expect(mockEmpleadoRepository.update).toHaveBeenCalledWith(
        'emp-456',
        toEmpleadoUpdateData(updateDto),
      );
      expect(result).toEqual({
        ...existingEmpleado,
        ...updateDto,
      });
    });

    it('debe lanzar BadRequestException si el empleado no existe', async () => {
      mockEmpleadoRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('noexiste', { nombre: 'Nuevo' }),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update('noexiste', { nombre: 'Nuevo' }),
      ).rejects.toThrow('El usuario no existe.');
    });

    it('debe lanzar BadRequestException si el nuevo email ya está en uso por otro empleado', async () => {
      const existingEmpleado = { ...mockEmpleadoEntity, id: 'emp-456' };
      const otroEmpleado = {
        ...mockEmpleadoEntity,
        id: 'emp-999',
        email: 'nuevo@email.com',
      };

      mockEmpleadoRepository.findById.mockResolvedValue(existingEmpleado);
      mockEmpleadoRepository.findByEmail.mockResolvedValue(otroEmpleado);

      const updateDto: UpdateEmpleadoDto = { email: 'nuevo@email.com' };

      await expect(service.update('emp-456', updateDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update('emp-456', updateDto)).rejects.toThrow(
        'El email ya está en uso.',
      );
    });

    it('debe permitir usar el mismo email (sin lanzar error)', async () => {
      const existingEmpleado = { ...mockEmpleadoEntity, id: 'emp-456' };

      mockEmpleadoRepository.findById.mockResolvedValue(existingEmpleado);
      mockEmpleadoRepository.findByEmail.mockResolvedValue(existingEmpleado); // mismo empleado
      mockEmpleadoRepository.update.mockResolvedValue(existingEmpleado);

      const updateDto: UpdateEmpleadoDto = { email: existingEmpleado.email };

      await service.update('emp-456', updateDto);

      expect(mockEmpleadoRepository.update).toHaveBeenCalled();
    });
  });

  describe('findForAuth', () => {
    it('debe devolver AuthDto con rol EMPLEADO si el empleado existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.findForAuth('empleado@test.com');

      expect(result).toEqual(
        AuthMapper.toAuthDto(mockEmpleadoEntity, Role.EMPLEADO),
      );
    });

    it('debe devolver null si el empleado no existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findForAuth('noexiste@empleado.com');

      expect(result).toBeNull();
    });
  });
});
