import { Inject } from '@nestjs/common';
import type { ICambioEstadoRepository } from '../../cambio-estado/repositories/cambio-estado.repository.interface';
import type { IReclamoRepository } from '../repositories/reclamo.repository.interface';
import { toReclamoDto } from '../mappers/toReclamoDto';
import { toCambioEstadoDto } from 'src/cambio-estado/mappers/toCambioEstadoDto';

export class ReclamoHelper {
  constructor(
    @Inject('ICambioEstadoRepository')
    private readonly CambioEstadoRepository: ICambioEstadoRepository,
    @Inject('IReclamoRepository')
    private readonly ReclamoRepository: IReclamoRepository,
  ) {}
  async findLastCambioEstado(id: string) {
    const cambioEstado =
      await this.CambioEstadoRepository.findLastCambioEstado(id);

    if (!cambioEstado)
      throw new Error('No se encontro el ultimo cambio de estado');

    return toCambioEstadoDto(cambioEstado);
  }

  async findOne(id: string) {
    const reclamo = await this.ReclamoRepository.findOne(id);
    if (!reclamo) throw new Error('No se encontro el reclamo');
    return toReclamoDto(reclamo);
  }
}
