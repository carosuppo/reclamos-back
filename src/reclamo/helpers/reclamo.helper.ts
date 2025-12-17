import { Inject, NotFoundException } from '@nestjs/common';
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
      throw new NotFoundException('No se encontro el ultimo cambio de estado');

    return toCambioEstadoDto(cambioEstado);
  }

  async findOne(id: string) {
    const reclamo = await this.ReclamoRepository.findOne(id);
    if (!reclamo) throw new NotFoundException('No se encontro el reclamo');
    return toReclamoDto(reclamo);
  }

  calcularTiempoResolucion(reclamos: { createdAt: Date; updatedAt: Date }[]) {
    if (reclamos.length === 0) {
      return 0;
    }

    const totalMs = reclamos.reduce(
      (acc, r) => acc + (r.updatedAt.getTime() - r.createdAt.getTime()),
      0,
    );

    const promedioMs = totalMs / reclamos.length;

    return +(promedioMs / 8.64e7).toFixed(2);
  }

  calcularCantidadPromedio(resueltos: number, total: number): number {
    if (total === 0) return 0;
    return +(resueltos / total).toFixed(2);
  }
}
