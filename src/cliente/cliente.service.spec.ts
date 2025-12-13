import { Test, TestingModule } from '@nestjs/testing';
import { ClienteService } from './cliente.service';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { UpdateClienteDto } from './dtos/update.cliente.dto';
import { BadRequestException } from '@nestjs/common';
import { toClienteDto } from './mappers/toClienteDto.mapper';
import { toClienteEntity } from './mappers/toClienteEntity.mapper';
import { toClienteUpdateData } from './mappers/toClienteParcial.mapper';
import { AuthMapper } from 'src/common/mappers/toAuthDto.mapper';
import { Role } from 'src/common/enums/role.enum';

const mockClienteEntity = {
  id: 'cli-123',
  email: 'test@cliente.com',
  contraseña: 'hashed123',
  nombre: 'Juan Pérez',
  telefono: '3511234567',
  role: Role.CLIENTE,
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClienteService,
        {
          provide: 'IClienteRepository',
          useValue: mockClienteRepository,
        },
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

  describe('register', () => {
    it('debe registrar un cliente correctamente y devolver ClienteDto', async () => {
      const registerDto: RegisterDto = {
        email: 'test@cliente.com',
        contraseña: 'pass123',
        nombre: 'Juan Pérez',
        telefono: '3511234567',
      };

      mockClienteRepository.create.mockResolvedValue(mockClienteEntity);

      const result = await service.register(registerDto);

      expect(mockClienteRepository.create).toHaveBeenCalledWith(
        toClienteEntity(registerDto),
      );
      expect(result).toEqual(toClienteDto(mockClienteEntity));
    });

    it('debe lanzar un Error genérico si el repository falla', async () => {
      const registerDto: RegisterDto = {
        email: 'error@cliente.com',
        contraseña: 'pass',
        nombre: 'Error',
        telefono: '000',
      };

      mockClienteRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.register(registerDto)).rejects.toThrow(
        'Error al crear el cliente: DB error',
      );
    });
  });

  describe('findOne', () => {
    it('debe devolver ClienteDto si el cliente existe', async () => {
      mockClienteRepository.findByEmail.mockResolvedValue(mockClienteEntity);

      const result = await service.findOne('test@cliente.com');

      expect(result).toEqual(toClienteDto(mockClienteEntity));
    });

    it('debe devolver null si el cliente no existe', async () => {
      mockClienteRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findOne('noexiste@cliente.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('debe actualizar el cliente correctamente', async () => {
      const existingCliente = { ...mockClienteEntity, id: 'cli-123' };
      const updateDto: UpdateClienteDto = {
        nombre: 'Juan Actualizado',
        telefono: '351999888',
      };

      mockClienteRepository.findById.mockResolvedValue(existingCliente);
      mockClienteRepository.findByEmail.mockResolvedValue(null); // no hay conflicto de email
      mockClienteRepository.update.mockResolvedValue({
        ...existingCliente,
        ...updateDto,
      });

      const result = await service.update('cli-123', updateDto);

      expect(mockClienteRepository.update).toHaveBeenCalledWith(
        'cli-123',
        toClienteUpdateData(updateDto),
      );
      expect(result).toEqual({
        ...existingCliente,
        ...updateDto,
      });
    });

    it('debe lanzar BadRequestException si el cliente no existe', async () => {
      mockClienteRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('noexiste', { nombre: 'Nuevo' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequestException si el nuevo email ya está en uso por otro cliente', async () => {
      const existingCliente = { ...mockClienteEntity, id: 'cli-123' };
      const otroCliente = {
        ...mockClienteEntity,
        id: 'cli-999',
        email: 'nuevo@email.com',
      };

      mockClienteRepository.findById.mockResolvedValue(existingCliente);
      mockClienteRepository.findByEmail.mockResolvedValue(otroCliente);

      const updateDto: UpdateClienteDto = { email: 'nuevo@email.com' };

      await expect(service.update('cli-123', updateDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.update('cli-123', updateDto)).rejects.toThrow(
        'El email ya está en uso.',
      );
    });

    it('debe permitir cambiar al mismo email (sin conflicto)', async () => {
      const existingCliente = { ...mockClienteEntity, id: 'cli-123' };

      mockClienteRepository.findById.mockResolvedValue(existingCliente);
      mockClienteRepository.findByEmail.mockResolvedValue(existingCliente); // mismo cliente
      mockClienteRepository.update.mockResolvedValue(existingCliente);

      const updateDto: UpdateClienteDto = { email: existingCliente.email };

      await service.update('cli-123', updateDto);

      expect(mockClienteRepository.update).toHaveBeenCalled();
    });
  });

  describe('findForAuth', () => {
    it('debe devolver AuthDto con rol CLIENTE si el cliente existe', async () => {
      mockClienteRepository.findByEmail.mockResolvedValue(mockClienteEntity);

      const result = await service.findForAuth('test@cliente.com');

      expect(result).toEqual(
        AuthMapper.toAuthDto(mockClienteEntity, Role.CLIENTE),
      );
    });

    it('debe devolver null si el cliente no existe', async () => {
      mockClienteRepository.findByEmail.mockResolvedValue(null);

      const result = await service.findForAuth('noexiste@cliente.com');

      expect(result).toBeNull();
    });
  });
});
