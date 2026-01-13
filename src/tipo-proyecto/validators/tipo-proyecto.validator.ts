import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITipoProyectoRepository } from '../repositories/tipo-proyecto.repository.interface';

@Injectable()
export class TipoProyectoValidator {
  constructor(
    @Inject('ITipoProyectoRepository')
    private readonly repository: ITipoProyectoRepository,
  ) {}
  async validateTipoProyecto(tipoProyectoId?: string): Promise<void> {
    if (tipoProyectoId) {
      const tipoProyecto = await this.repository.findById(tipoProyectoId);
      if (!tipoProyecto) {
        throw new NotFoundException('El tipo de proyecto no existe');
      }
    }
  }
}
