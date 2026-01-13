import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterDTO } from '../auth/dtos/register.dto';
import { AuthDTO } from '../common/dtos/auth.dto';
import { ClienteDTO } from './dtos/cliente.dto';
import { UpdateClienteDTO } from './dtos/update.cliente.dto';
import { ClienteMapper as mapper } from './mappers/cliente.mapper';
import type { IClienteRepository } from './repositories/cliente.repository.interface';
import { ClienteValidator } from './validators/cliente.validator';

@Injectable()
export class ClienteService {
  constructor(
    @Inject('IClienteRepository')
    private readonly repository: IClienteRepository,
    private readonly validator: ClienteValidator,
  ) {}

  async create(dto: RegisterDTO): Promise<ClienteDTO> {
    // Mapea al formato esperado por el repositorio
    const data = mapper.toClienteCreateData(dto);

    const cliente = await this.repository.create(data);

    // Mapea al formato esperado por el controlador
    return mapper.toClienteDTO(cliente);
  }

  async findByEmail(email: string): Promise<ClienteDTO> {
    const cliente = await this.repository.findByEmail(email);

    if (!cliente) {
      throw new BadRequestException('No se encontró el cliente con ese email.');
    }

    // Mapea al formato esperado por el controlador
    return mapper.toClienteDTO(cliente);
  }

  async findForAuth(email: string): Promise<AuthDTO | null> {
    const cliente = await this.repository.findByEmail(email);
    if (cliente) {
      return mapper.toAuthClienteDTO(cliente);
    }
    // Debe devolver null y no tirar error, porque sino no se puede autenticar el login en caso de que sea empleado
    return null;
  }

  async findById(id: string): Promise<ClienteDTO> {
    const cliente = await this.repository.findById(id);
    if (!cliente) {
      throw new BadRequestException('No se encontró el cliente con ese id.');
    }
    return mapper.toClienteDTO(cliente);
  }

  async update(id: string, dto: UpdateClienteDTO): Promise<boolean> {
    // Validar exitencia del cliente y email unico
    await this.validator.validateUpdate(id, dto.email);

    // Mapear al formato esperado por el repositorio
    const data = mapper.toClienteUpdateData(id, dto);

    const cliente = await this.repository.update(data);
    return !!cliente;
  }
}
