import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import type { IProyectoRepository } from './repositories/proyecto.repository.interface';
import { aProyectoDto, aProyectoInterfaz } from './mapper/proyecto.mapper';
import { ProyectoInterfaz } from './interfaces/proyecto.interfaz';
import { ProyectoValidador } from './validator/proyecto.validator';

@Injectable()
export class ProyectoService {
  constructor(
    @Inject('IProyectoRepository')
    private readonly repository: IProyectoRepository,
    private readonly validator: ProyectoValidador,
  ) {}

  async create(dto: CreateProyectoDto) {
    await this.validator.validate(dto.tipoProyectoId);

    const proyectoInterfaz = aProyectoInterfaz(dto) as ProyectoInterfaz;
    const proyecto = await this.repository.create(proyectoInterfaz);
    return aProyectoDto(proyecto);
  }

  async findAll() {
    const proyectos = await this.repository.findAll();
    return proyectos.map(aProyectoDto);
  }

  async findOne(id: string) {
    const proyecto = await this.repository.findOne(id);

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    return aProyectoDto(proyecto);
  }

  async findByTipoProyecto(tipoProyectoId: string) {
    const proyectos = await this.repository.findByTipoProyecto(tipoProyectoId);

    if (!proyectos) {
      throw new NotFoundException('No hay proyectos con este tipo de proyecto');
    }

    return proyectos.map(aProyectoDto);
  }

  async update(id: string, dto: UpdateProyectoDto) {
    if (dto.tipoProyectoId) {
      await this.validator.validate(dto.tipoProyectoId);
    }

    const proyectoInterfaz = aProyectoInterfaz(dto);
    const proyecto = await this.repository.update(id, proyectoInterfaz);
    return aProyectoDto(proyecto);
  }

  async remove(id: string) {
    return await this.repository.remove(id);
  }
}
