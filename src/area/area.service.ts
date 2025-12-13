import { Injectable, Inject } from '@nestjs/common';
import { CreateAreaDto } from './dto/create-area.dto';
import { UpdateAreaDto } from './dto/update-area.dto';
import { AreaMapper } from './mappers/area.mapper';
import { AreaDto } from './dto/area.dto';
import type { IAreaRepository } from './repository/area.repository.interface';

@Injectable()
export class AreaService {
  constructor(
    @Inject('IAreaRepository')
    private readonly repository: IAreaRepository,
  ) {}

  async create(createAreaDto: CreateAreaDto): Promise<AreaDto | null> {
    const area = await this.repository.create(createAreaDto);
    return AreaMapper.toAreaDto(area);
  }

  async findAll(): Promise<(AreaDto | null)[]> {
    const areas = await this.repository.findAll();
    return areas.map((area) => AreaMapper.toAreaDto(area));
  }

  async findById(id: string): Promise<AreaDto | null> {
    const area = await this.repository.findById(id);
    return AreaMapper.toAreaDto(area);
  }

  async update(
    id: string,
    updateAreaDto: UpdateAreaDto,
  ): Promise<AreaDto | null> {
    const area = await this.repository.update(id, updateAreaDto);
    return AreaMapper.toAreaDto(area);
  }

  async softDelete(id: string) {
    return this.repository.softDelete(id);
  }
}
