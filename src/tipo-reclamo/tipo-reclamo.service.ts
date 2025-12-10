import { Injectable, Inject } from '@nestjs/common';
import { TipoReclamoRepository } from './repository/tipo-reclamo.repository';
import { TipoReclamoDto } from './dto/tipo-reclamo.dto';
import { TipoReclamoMapper } from './mappers/tipo-reclamo.mapper';

@Injectable()
export class TipoReclamoService {
  constructor(
    @Inject('ITipoReclamoRepository')
    private readonly repository: TipoReclamoRepository,
  ) {}

  async findAll(): Promise<TipoReclamoDto[]> {
    const tipoReclamos = await this.repository.findAll();
    return tipoReclamos.map((tr) => TipoReclamoMapper.toTipoReclamoDto(tr));
  }

  async findOne(id: string): Promise<TipoReclamoDto> {
    const tipoReclamo = await this.repository.findById(id);
    return TipoReclamoMapper.toTipoReclamoDto(tipoReclamo);
  }
}
