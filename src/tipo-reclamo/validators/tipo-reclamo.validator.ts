import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITipoReclamoRepository } from '../repositories/tipo-reclamo.repository.interface';

@Injectable()
export class TipoReclamoValidator {
  constructor(
    @Inject('ITipoReclamoRepository')
    private readonly repository: ITipoReclamoRepository,
  ) {}
  async validateTipoReclamo(tipoReclamoId?: string): Promise<void> {
    if (tipoReclamoId) {
      const tipoReclamo = await this.repository.findById(tipoReclamoId);
      if (!tipoReclamo) {
        throw new NotFoundException('El tipo de Reclamo no existe');
      }
    }
  }
}
