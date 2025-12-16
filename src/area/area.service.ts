import { Injectable, Inject } from '@nestjs/common';
import { CreateAreaDto } from './dtos/create-area.dto';
import { UpdateAreaDto } from './dtos/update-area.dto';
import type { IAreaRepository } from './repositories/area.repository.interface';
import { AreaDto } from './dtos/area.dto';
import { toAreaDto } from './mappers/area.mapper';

@Injectable()
export class AreaService {
  constructor(
    @Inject('IAreaRepository')
    private readonly repository: IAreaRepository,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<AreaDto | null> {
    const area = await this.repository.create(createAreaDto);
    return toAreaDto(area);
  }

  async findAll(): Promise<(AreaDto | null)[]> {
    const areas = await this.repository.findAll();
    return areas.map((area) => toAreaDto(area));
  }

  async findOne(id: string): Promise<AreaDto | null> {
    const area = await this.repository.findById(id);
    return toAreaDto(area);
  }

  async update(
    id: string,
    updateAreaDto: UpdateAreaDto,
  ): Promise<AreaDto | null> {
    const area = await this.repository.update(id, updateAreaDto);
    return toAreaDto(area);
  }

  async softDelete(id: string) {
    return this.repository.softDelete(id);
  }

  async findByName(nombre: string): Promise<AreaDto | null> {
    const area = await this.repository.findByName(nombre);
    return toAreaDto(area);
  }
}
