import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Estados } from '@prisma/client';
import { CambioEstadoDTO } from './dtos/cambio-estado.dto';
import { CambioEstadoMapper as mapper } from './mappers/cambio-estado.mapper';
import type { ICambioEstadoRepository } from './repositories/cambio-estado.repository.interface';

@Injectable()
export class CambioEstadoService {
  constructor(
    @Inject('ICambioEstadoRepository')
    private readonly repository: ICambioEstadoRepository,
  ) {}

  async findByReclamo(id: string): Promise<CambioEstadoDTO[]> {
    const cambios = await this.repository.findByReclamoId(id);

    // Mapear array de cambios de estado al formato de transferencia de datos
    return cambios.map((cambio) => mapper.toCambioEstadoDTO(cambio));
  }

  async findByEstado(estado: Estados): Promise<CambioEstadoDTO[]> {
    const cambios = await this.repository.findByEstado(estado);

    // Mapear array de cambios de estado al formato de transferencia de datos
    return cambios.map((cambio) => mapper.toCambioEstadoDTO(cambio));
  }

  async findLastCambioEstado(id: string) {
    const cambioEstado = await this.repository.findLastCambioEstado(id);

    if (!cambioEstado)
      throw new NotFoundException('No se encontro el ultimo cambio de estado');

    return mapper.toCambioEstadoDTO(cambioEstado);
  }
}
