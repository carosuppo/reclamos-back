import { Inject, Injectable } from '@nestjs/common';
import { CreateReclamoDto } from './dtos/create-reclamo.dto';
import type { IReclamoRepository } from './repositories/reclamo.repository.interface';
import { ReclamoDto } from './dtos/reclamo.dto';
import { toReclamoCreateData } from './mappers/toReclamoEntity';
import { toReclamoDto } from './mappers/toReclamoDto';
import { ReclamoValidator } from './validators/reclamo.validator';

@Injectable()
export class ReclamoService {
  constructor(
    @Inject('IReclamoRepository')
    private readonly repository: IReclamoRepository,
    private readonly validator: ReclamoValidator,
  ) {}

  async create(dto: CreateReclamoDto, userId: string): Promise<ReclamoDto> {
    // 1. validar tipo de reclamo
    await this.validator.validateTipoReclamo(dto.tipoReclamoId);

    // 2. validar proyecto
    await this.validator.validateProyecto(dto.proyectoId);

    // 3. crear el reclamo base
    const data = toReclamoCreateData(dto, userId);
    const reclamo = await this.repository.create(data, userId);
    return toReclamoDto(reclamo);
  }

  async findByCliente(clienteId: string): Promise<ReclamoDto[]> {
    const reclamos = await this.repository.findByCliente(clienteId);
    return reclamos.map(toReclamoDto);
  }
}
