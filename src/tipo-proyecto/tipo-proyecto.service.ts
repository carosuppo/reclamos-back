import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TipoProyectoDTO } from './dtos/tipo-proyecto.dto';
import { aTipoProyectoDTO } from './mappers/tipo-proyecto.mapper';
import type { ITipoProyectoRepository } from './repositories/tipo-proyecto.repository.interface';

@Injectable()
export class TipoProyectoService {
  constructor(
    @Inject('ITipoProyectoRepository')
    private readonly repository: ITipoProyectoRepository,
  ) {}

  async findAll(): Promise<TipoProyectoDTO[]> {
    const tipoProyectos = await this.repository.findAll();
    return tipoProyectos.map((tipoProyecto) => aTipoProyectoDTO(tipoProyecto));
  }

  async findById(id: string): Promise<TipoProyectoDTO> {
    const tipoProyecto = await this.repository.findById(id);

    if (!tipoProyecto) {
      throw new NotFoundException('No existe un tipo de proyecto con ese ID.');
    }

    return aTipoProyectoDTO(tipoProyecto);
  }
}
