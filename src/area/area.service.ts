import { Injectable, Inject } from '@nestjs/common';
import { CreateAreaDto } from './dtos/create-area.dto';
import { UpdateAreaDto } from './dtos/update-area.dto';
import { AreaRepository } from './repositories/area.repository';
import { AreaMapper } from './mappers/area.mapper';
import { AreaDto } from './dtos/area.dto';

@Injectable()
export class AreaService {
  constructor(
    @Inject('IAreaRepository') private readonly repository: AreaRepository,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<AreaDto> {
    const area = await this.repository.create(createAreaDto);
    return AreaMapper.toAreaDto(area);
  }

  async findAll(): Promise<AreaDto[]> {
    const areas = await this.repository.findAll();
    return areas.map((area) => AreaMapper.toAreaDto(area));
  }

  async findOne(id: string): Promise<AreaDto | null> {
    const area = await this.repository.findById(id);
    return AreaMapper.toAreaDto(area);
  }

  async update(id: string, updateAreaDto: UpdateAreaDto): Promise<AreaDto> {
    const area = await this.repository.update(id, updateAreaDto);
    return AreaMapper.toAreaDto(area);
  }

  async softDelete(id: string) {
    return this.repository.softDelete(id);
  }

  async findByName(nombre: string): Promise<AreaDto | null> {
    const area = await this.repository.findByName(nombre);
    return AreaMapper.toAreaDto(area);
  }
}
