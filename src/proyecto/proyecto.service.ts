import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { TipoProyectoValidator } from '../tipo-proyecto/validators/tipo-proyecto.validator';
import {
  CreateProyectoDTO,
  UpdateProyectoDTO,
} from './dtos/create-proyecto.dto';
import { ProyectoDTO } from './dtos/proyecto.dto';
import { ProyectoMapper as mapper } from './mappers/proyecto.mapper';
import type { IProyectoRepository } from './repositories/proyecto.repository.interface';

@Injectable()
export class ProyectoService {
  constructor(
    @Inject('IProyectoRepository')
    private readonly repository: IProyectoRepository,
    private readonly tipoProyectoValidator: TipoProyectoValidator,
  ) {}

  async create(dto: CreateProyectoDTO, user: string): Promise<boolean> {
    // Validar que el tipo de proyecto exista antes de crear el proyecto
    await this.tipoProyectoValidator.validateTipoProyecto(dto.tipoProyectoId);

    // Mapear el DTO para llevarlo al formato esperado por el repositorio
    const data = mapper.aProyectoCreateData(dto, user);

    await this.repository.create(data);
    return true;
  }

  async update(id: string, dto: UpdateProyectoDTO): Promise<boolean> {
    // Validar que el tipo de proyecto existan
    await this.tipoProyectoValidator.validateTipoProyecto(dto.tipoProyectoId);

    // Mapear el DTO para llevarlo al formato esperado por el repositorio
    const proyectoInterfaz = mapper.aProyectoUpdateData(id, dto);

    await this.repository.update(proyectoInterfaz);
    return true;
  }

  async findAll(user: string): Promise<ProyectoDTO[]> {
    const proyectos = await this.repository.findAll(user);

    // Mapear los proyectos para llevarlo al formato de transferencia de datos
    return proyectos.map((proyecto) => mapper.aProyectoDTO(proyecto));
  }

  async findById(id: string): Promise<ProyectoDTO> {
    const proyecto = await this.repository.findById(id);

    if (!proyecto) {
      throw new NotFoundException('Proyecto no encontrado');
    }

    // Mapear el proyecto para llevarlo al formato de transferencia de datos
    return mapper.aProyectoDTO(proyecto);
  }

  async findByTipoProyecto(
    tipoProyectoId: string,
    user: string,
  ): Promise<ProyectoDTO[]> {
    const proyectos = await this.repository.findByTipoProyecto(
      tipoProyectoId,
      user,
    );

    if (proyectos.length === 0) {
      throw new NotFoundException('No hay proyectos con este tipo de proyecto');
    }

    // Mapear los proyectos para llevarlo al formato de transferencia de datos
    return proyectos.map((proyecto) => mapper.aProyectoDTO(proyecto));
  }

  async delete(id: string): Promise<boolean> {
    // No se necesita validar si el proyecto existe porque el repositorio lo hace
    await this.repository.delete(id);

    return true;
  }
}
