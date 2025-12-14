import { Injectable, Inject } from '@nestjs/common';
import { TipoReclamoDto } from './dtos/tipo-reclamo.dto';
import { TipoReclamoMapper } from './mappers/tipo-reclamo.mapper';
import type { ITipoReclamoRepository } from './repositories/tipo-reclamo.repository.interface';

@Injectable()
export class TipoReclamoService {
  constructor(
    @Inject('ITipoReclamoRepository')
    private readonly repository: ITipoReclamoRepository,
    private readonly mapper: TipoReclamoMapper,
  ) {}

  async findAll(): Promise<TipoReclamoDto[]> {
    const tipoReclamos = await this.repository.findAll();
    return tipoReclamos.map((tr) => this.mapper.toTipoReclamoDto(tr));
  }

  async findOne(id: string): Promise<TipoReclamoDto> {
    const tipoReclamo = await this.repository.findById(id);
    return this.mapper.toTipoReclamoDto(tipoReclamo);
  }
}
