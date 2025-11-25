import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITipoProyectoRepository } from './repositories/tipo-proyecto.repository.interface';
import { aTipoProyectoDto } from './mapper/tipo-proyecto.mapper';

@Injectable()
export class TipoProyectoService {
  constructor(
    @Inject('ITipoProyectoRepository')
    private readonly repository: ITipoProyectoRepository,
  ) {}

  async findAll() {
    const tipoProyectos = await this.repository.findAll();
    return tipoProyectos.map(aTipoProyectoDto);
  }

  async findOne(id: string) {
    const tipoProyecto = await this.repository.findOne(id);

    if (!tipoProyecto) {
      throw new NotFoundException('No existe un tipo de proyecto con ese ID.');
    }

    return aTipoProyectoDto(tipoProyecto);
  }
}
