import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { AreaDTO } from './dtos/area.dto';
import { CreateAreaDTO, UpdateAreaDTO } from './dtos/create-area.dto';
import { AreaMapper as mapper } from './mappers/area.mapper';
import type { IAreaRepository } from './repositories/area.repository.interface';

@Injectable()
export class AreaService {
  constructor(
    @Inject('IAreaRepository')
    private readonly repository: IAreaRepository,
  ) {}

  async create(dto: CreateAreaDTO): Promise<boolean> {
    // Mapear al formato esperado por el repositorio
    const data = mapper.toAreaCreateData(dto);

    await this.repository.create(data);
    return true;
  }

  async update(id: string, dto: UpdateAreaDTO): Promise<boolean> {
    // Mapear al formato esperado por el repositorio
    const data = mapper.toAreaUpdateData(id, dto);

    await this.repository.update(data);
    return true;
  }

  async findAll(): Promise<AreaDTO[]> {
    const areas = await this.repository.findAll();

    // Mapear el array de areas al formato de transferencia de datos
    return areas.map((area) => mapper.toAreaDto(area));
  }

  async findById(id: string): Promise<AreaDTO> {
    const area = await this.repository.findById(id);
    if (!area) throw new NotFoundException('No existe un área con ese nombre.');

    // Mapear al formato de transferencia de datos
    return mapper.toAreaDto(area);
  }

  async findByNombre(nombre: string): Promise<AreaDTO> {
    const area = await this.repository.findByName(nombre);
    if (!area) throw new NotFoundException('No existe un área con ese nombre.');

    // Mapear al formato de transferencia de datos
    return mapper.toAreaDto(area);
  }

  async delete(id: string): Promise<boolean> {
    await this.repository.delete(id);
    return true;
  }
}
