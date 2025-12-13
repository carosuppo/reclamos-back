import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dtos/register.dto';
import { toClienteDto } from './mappers/toClienteDto.mapper';
import { ClienteDto } from './dtos/cliente.dto';
import { UpdateClienteDto } from './dtos/update.cliente.dto';
import { toClienteUpdateData } from './mappers/toClienteParcial.mapper';
import { AuthDto } from 'src/common/dtos/auth.dto';
import { AuthMapper } from 'src/common/mappers/toAuthDto.mapper';
import type { IClienteRepository } from './repositories/cliente.repository.interface';
import { Role } from 'src/common/enums/role.enum';
import { toClienteEntity } from './mappers/toClienteEntity.mapper';

@Injectable()
export class ClienteService {
  constructor(
    @Inject('IClienteRepository')
    private readonly clienteRepository: IClienteRepository,
  ) {}

  async register(registerDto: RegisterDto): Promise<ClienteDto> {
    try {
      const data = toClienteEntity(registerDto);
      const cliente = await this.clienteRepository.create(data);
      return toClienteDto(cliente);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(`Error al crear el cliente: ${error.message}`);
      }
      throw new Error('Error al crear el cliente: error desconocido');
    }
  }

  async findOne(email: string): Promise<ClienteDto | null> {
    const cliente = await this.clienteRepository.findByEmail(email);
    if (!cliente) {
      return null;
    }
    return toClienteDto(cliente);
  }

  async update(id: string, dto: UpdateClienteDto) {
    const existing = await this.clienteRepository.findById(id);
    if (!existing) {
      throw new BadRequestException('El usuario no existe.');
    }

    if (dto.email) {
      const emailInUse = await this.clienteRepository.findByEmail(dto.email);
      if (emailInUse && emailInUse.id !== id) {
        throw new BadRequestException('El email ya está en uso.');
      }
    }

    const updatedData = toClienteUpdateData(dto);
    return this.clienteRepository.update(id, updatedData);
  }

  remove(id: number) {
    return `This action removes a #${id} cliente`;
  }

  async findForAuth(email: string): Promise<AuthDto | null> {
    const cliente = await this.clienteRepository.findByEmail(email);
    if (cliente) {
      return AuthMapper.toAuthDto(cliente, Role.CLIENTE);
    }
    return null;
  }
}
