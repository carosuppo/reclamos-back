import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from 'src/auth/dto/register.dto';
import { ClienteRepository } from './repositories/cliente.repository';
import { toClienteDto } from './mappers/toClienteDto.mapper';
import { ClienteDto } from './dto/cliente.dto';
import { toUsuarioEntity } from 'src/common/mappers/toUsuarioEntity.mapper';
import { UpdateClienteDto } from './dto/update.cliente.dto';
import { toClienteUpdateData } from './mappers/toClienteParcial.mapper';

@Injectable()
export class ClienteService {
  constructor(private readonly clienteRepository: ClienteRepository) {}

  async register(registerDto: RegisterDto): Promise<ClienteDto> {
    try {
      const data = toUsuarioEntity(registerDto);
      const cliente = await this.clienteRepository.create(data);
      return toClienteDto(cliente);
    } catch (error) {
      throw new Error(`Error al crear el cliente: ${error.message}`);
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
}
