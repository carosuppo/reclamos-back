import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { RegisterDTO } from '../auth/dtos/register.dto';
import { UpdateEmpleadoDTO } from './dtos/update-empleado.dto';
import { EmpleadoMapper as mapper } from './mappers/empleado.mapper';
import { EmpleadoValidator } from './validators/empleado.validator';
import { AuthValidator } from '../auth/validators/auth.validator';
import { AreaValidator } from '../area/validators/area.validator';

const mockEmpleadoEntity = {
  id: 'emp-1',
  email: 'empleado@test.com',
  contraseña: 'hashed',
  nombre: 'Ana',
  telefono: '123',
  areaId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('EmpleadoService', () => {
  let service: EmpleadoService;

  const mockEmpleadoRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    assignArea: jest.fn(),
  };

  const mockValidator = {
    validate: jest.fn(),
  };

  const mockAuthValidator = {
    validateEmail: jest.fn(),
  };

  const mockAreaValidator = {
    validate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmpleadoService,
        { provide: 'IEmpleadoRepository', useValue: mockEmpleadoRepository },
        { provide: EmpleadoValidator, useValue: mockValidator },
        { provide: AuthValidator, useValue: mockAuthValidator },
        { provide: AreaValidator, useValue: mockAreaValidator },
      ],
    }).compile();

    service = module.get<EmpleadoService>(EmpleadoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('registra correctamente un empleado', async () => {
      const dto: RegisterDTO = {
        email: 'empleado@test.com',
        contraseña: '123',
        nombre: 'Ana',
        telefono: '123',
      };

      mockEmpleadoRepository.create.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.create(dto);

      expect(mockEmpleadoRepository.create).toHaveBeenCalledWith(
        mapper.toEmpleadoEntity(dto),
      );
      expect(result).toEqual(mapper.toEmpleadoDTO(mockEmpleadoEntity as never));
    });
  });

  describe('update', () => {
    it('actualiza correctamente', async () => {
      const dto: UpdateEmpleadoDTO = { nombre: 'Nuevo' };

      mockValidator.validate.mockResolvedValue(true);
      mockEmpleadoRepository.update.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.update('emp-1', dto);

      expect(mockValidator.validate).toHaveBeenCalledWith('emp-1');
      expect(mockEmpleadoRepository.update).toHaveBeenCalledWith(
        mapper.toEmpleadoUpdateData('emp-1', dto),
      );
      expect(result).toBe(true);
    });

    it('valida email si se envia', async () => {
      const dto: UpdateEmpleadoDTO = { email: 'nuevo@test.com' };

      mockValidator.validate.mockResolvedValue(true);
      mockAuthValidator.validateEmail.mockResolvedValue(true);
      mockEmpleadoRepository.update.mockResolvedValue(mockEmpleadoEntity);

      await service.update('emp-1', dto);

      expect(mockAuthValidator.validateEmail).toHaveBeenCalledWith(dto.email);
    });
  });

  describe('assignArea', () => {
    it('asigna area correctamente', async () => {
      mockValidator.validate.mockResolvedValue(true);
      mockAreaValidator.validate.mockResolvedValue(true);
      mockEmpleadoRepository.assignArea.mockResolvedValue(true);

      const result = await service.assignArea('emp-1', { areaId: 'area-1' } as never);

      expect(mockValidator.validate).toHaveBeenCalledWith('emp-1');
      expect(mockAreaValidator.validate).toHaveBeenCalledWith('area-1');
      expect(mockEmpleadoRepository.assignArea).toHaveBeenCalledWith('emp-1', 'area-1');
      expect(result).toBe(true);
    });
  });

  describe('findByEmail', () => {
    it('devuelve EmpleadoDTO si existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.findByEmail('empleado@test.com');

      expect(result).toEqual(mapper.toEmpleadoDTO(mockEmpleadoEntity as never));
    });

    it('lanza NotFoundException si no existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(null);

      await expect(service.findByEmail('no@existe.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findForAuth', () => {
    it('devuelve AuthDTO si existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.findForAuth('empleado@test.com');

      expect(result).toEqual(mapper.toAuthEmpleadoDTO(mockEmpleadoEntity as never));
    });

    it('devuelve null si no existe', async () => {
      mockEmpleadoRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findForAuth('no@existe.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('devuelve EmpleadoDTO si existe', async () => {
      mockEmpleadoRepository.findById.mockResolvedValue(mockEmpleadoEntity);

      const result = await service.findById('emp-1');

      expect(result).toEqual(mapper.toEmpleadoDTO(mockEmpleadoEntity as never));
    });

    it('lanza NotFoundException si no existe', async () => {
      mockEmpleadoRepository.findById.mockResolvedValue(null);

      await expect(service.findById('emp-x')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAreaById', () => {
    it('devuelve area del empleado', async () => {
      mockEmpleadoRepository.findById.mockResolvedValue({
        ...mockEmpleadoEntity,
        areaId: 'area-1',
      });

      const result = await service.findAreaById('emp-1');

      expect(result).toBe('area-1');
    });

    it('lanza NotFoundException si no existe', async () => {
      mockEmpleadoRepository.findById.mockResolvedValue(null);

      await expect(service.findAreaById('emp-x')).rejects.toThrow(NotFoundException);
    });
  });
});
