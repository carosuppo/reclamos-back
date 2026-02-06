import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { RegisterDTO } from '../auth/dtos/register.dto';
import { UpdateClienteDTO } from './dtos/update.cliente.dto';
import { ClienteMapper as mapper } from './mappers/cliente.mapper';
import { ClienteValidator } from './validators/cliente.validator';

const mockClienteEntity = {
  id: 'cli-123',
  email: 'test@cliente.com',
  contraseña: 'hashed123',
  nombre: 'Juan Perez',
  telefono: '3511234567',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

describe('ClienteService', () => {
  let service: ClienteService;

  const mockClienteRepository = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
  };

  const mockValidator = {
    validateUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        { provide: 'IClienteRepository', useValue: mockClienteRepository },
        { provide: ClienteValidator, useValue: mockValidator },
      ],
    }).compile();

    service = module.get<ClienteService>(ClienteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('crea cliente y devuelve DTO', async () => {
      const registerDto: RegisterDTO = {
        email: 'test@cliente.com',
        contraseña: 'pass123',
        nombre: 'Juan Perez',
        telefono: '3511234567',
      };

      mockClienteRepository.create.mockResolvedValue(mockClienteEntity);

      const result = await service.create(registerDto);

      expect(mockClienteRepository.create).toHaveBeenCalledWith(
        mapper.toClienteCreateData(registerDto),
      );
      expect(result).toEqual(mapper.toClienteDTO(mockClienteEntity as never));
    });
  });

  describe('findByEmail', () => {
    it('devuelve ClienteDTO si existe', async () => {
      mockClienteRepository.findByEmail.mockResolvedValue(mockClienteEntity);

      const result = await service.findByEmail('test@cliente.com');

      expect(result).toEqual(mapper.toClienteDTO(mockClienteEntity as never));
    });

    it('lanza BadRequestException si no existe', async () => {
      mockClienteRepository.findByEmail.mockResolvedValue(null);

      await expect(service.findByEmail('no@existe.com')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findForAuth', () => {
    it('devuelve AuthDTO si existe', async () => {
      mockClienteRepository.findByEmail.mockResolvedValue(mockClienteEntity);

      const result = await service.findForAuth('test@cliente.com');

      expect(result).toEqual(mapper.toAuthClienteDTO(mockClienteEntity as never));
    });

    it('devuelve null si no existe', async () => {
      mockClienteRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findForAuth('no@existe.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('devuelve ClienteDTO si existe', async () => {
      mockClienteRepository.findById.mockResolvedValue(mockClienteEntity);

      const result = await service.findById('cli-123');

      expect(result).toEqual(mapper.toClienteDTO(mockClienteEntity as never));
    });

    it('lanza BadRequestException si no existe', async () => {
      mockClienteRepository.findById.mockResolvedValue(null);

      await expect(service.findById('cli-x')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('valida y actualiza cliente', async () => {
      const updateDto: UpdateClienteDTO = {
        nombre: 'Nuevo',
        telefono: '123',
      };

      mockValidator.validateUpdate.mockResolvedValue(true);
      mockClienteRepository.update.mockResolvedValue(mockClienteEntity);

      const result = await service.update('cli-123', updateDto);

      expect(mockValidator.validateUpdate).toHaveBeenCalledWith(
        'cli-123',
        updateDto.email,
      );
      expect(mockClienteRepository.update).toHaveBeenCalledWith(
        mapper.toClienteUpdateData('cli-123', updateDto),
      );
      expect(result).toBe(true);
    });
  });
});
