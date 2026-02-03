import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TipoReclamoDTO } from './dtos/tipo-reclamo.dto';
import { toTipoReclamoDTO } from './mappers/tipo-reclamo.mapper';
import type { ITipoReclamoRepository } from './repositories/tipo-reclamo.repository.interface';

@Injectable()
export class TipoReclamoService {
  constructor(
    @Inject('ITipoReclamoRepository')
    private readonly repository: ITipoReclamoRepository,
  ) {}

  async findAll(): Promise<TipoReclamoDTO[]> {
    const tipoReclamos = await this.repository.findAll();

    // Mapea la información traída de la BD a DTO
    return tipoReclamos.map((tipoReclamo) => toTipoReclamoDTO(tipoReclamo));
  }

  async findById(id: string): Promise<TipoReclamoDTO> {
    const tipoReclamo = await this.repository.findById(id);

    if (!tipoReclamo)
      throw new NotFoundException(`El tipo de reclamo con id ${id} no existe`);

    // Mapea la información traída de la BD a DTO
    return toTipoReclamoDTO(tipoReclamo);
  }
}
