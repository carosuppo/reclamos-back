import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { AreaService } from 'src/area/area.service';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UpdateEmpleadoDto } from './dtos/update-empleado.dto';
import { AuthMapper } from 'src/common/mappers/toAuthDto.mapper';
import { Role } from 'src/common/enums/role.enum';

describe('EmpleadoService', () => {
  let service: EmpleadoService;

  const mockEmpleadoEntity = {
    id: 'emp-1',
    email: 'empleado@test.com',
    contraseña: 'hashed',
    nombre: 'Ana',
    telefono: '123',
    areaId: null,
  };

  const mockEmpleadoRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    asignarArea: jest.fn(),
  };

  const mockAreaService = {
    findByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpleadoService,
        {
          provide: 'IEmpleadoRepository',
          useValue: mockEmpleadoRepository,
        },
        {
          provide: AreaService,
          useValue: mockAreaService,
        },
      ],
    }).compile();

    service = module.get<EmpleadoService>(EmpleadoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  /* ===============================
        register
     =============================== */

  describe('register', () => {
    it('registra correctamente un empleado', async () => {
      const dto: RegisterDto = {
        email: 'empleado@test.com',
        contraseña: '123',
        nombre: 'Ana',
        telefono: '123',
      };

      mockEmpleadoRepository.create.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.register(dto);

      expect(result.email).toBe(dto.email);
    });

    it('lanza error con mensaje si falla el repository', async () => {
      mockEmpleadoRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.register({} as RegisterDto)).rejects.toThrow(
        'Error al crear el empleado: DB error',
      );
    });

    it('lanza error genérico si no es instancia de Error', async () => {
      mockEmpleadoRepository.create.mockRejectedValue('boom');

      await expect(service.register({} as RegisterDto)).rejects.toThrow(
        'Error al crear el empleado: error desconocido',
      );
    });
  });

  /* ===============================
        update
     =============================== */

  describe('update', () => {
    it('actualiza correctamente', async () => {
      mockEmpleadoRepository.findById.mockResolvedValue(mockEmpleadoEntity);
      mockEmpleadoRepository.findByEmail.mockResolvedValue(null);
      mockEmpleadoRepository.update.mockResolvedValue(mockEmpleadoEntity);

      const dto: UpdateEmpleadoDto = { nombre: 'Nuevo' };

      const result = await service.update('emp-1', dto);

      expect(mockEmpleadoRepository.update).toHaveBeenCalled();
      expect(result).toBe(mockEmpleadoEntity);
    });

    it('lanza error si el empleado no existe', async () => {
      mockEmpleadoRepository.findById.mockResolvedValue(null);

      await expect(service.update('no-id', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('lanza error si el email ya está en uso', async () => {
      mockEmpleadoRepository.findById.mockResolvedValue(mockEmpleadoEntity);
      mockEmpleadoRepository.findByEmail.mockResolvedValue({
        ...mockEmpleadoEntity,
        id: 'otro-id',
      });

      await expect(
        service.update('emp-1', { email: 'empleado@test.com' }),
      ).rejects.toThrow('El email ya está en uso.');
    });
  });

  /* ===============================
        findOne
     =============================== */

  describe('findOne', () => {
    it('devuelve EmpleadoDto si existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.findOne('empleado@test.com');

      expect(result?.email).toBe(mockEmpleadoEntity.email);
    });

    it('devuelve null si no existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findOne('no@existe.com');

      expect(result).toBeNull();
    });
  });

  /* ===============================
        findForAuth
     =============================== */

  describe('findForAuth', () => {
    it('devuelve AuthDto si existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.findForAuth('empleado@test.com');

      expect(result).toEqual(
        AuthMapper.toAuthDto(mockEmpleadoEntity, Role.EMPLEADO),
      );
    });

    it('devuelve null si no existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findForAuth('no@existe.com');

      expect(result).toBeNull();
    });
  });

  /* ===============================
        asignarArea
     =============================== */

  describe('asignarArea', () => {
    it('lanza error si el área no existe', async () => {
      mockAreaService.findByName.mockResolvedValue(null);

      await expect(
        service.asignarArea('empleado@test.com', { area: 'Inexistente' }),
      ).rejects.toThrow('El area no existe.');
    });
  });

  /* ===============================
        remove
     =============================== */

  describe('remove', () => {
    it('retorna mensaje de borrado', () => {
      const result = service.remove(1);
      expect(result).toContain('1');
    });
  });
});
