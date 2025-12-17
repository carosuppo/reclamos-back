import { CreateAreaDto } from '../dtos/create-area.dto';
import { UpdateAreaDto } from '../dtos/update-area.dto';
import { Area } from '@prisma/client';

export interface IAreaRepository {
  create(data: CreateAreaDto): Promise<Area>;
  update(id: string, data: UpdateAreaDto): Promise<Area>;
  findAll(): Promise<Area[]>;
  findById(id: string): Promise<Area>;
  findByName(name: string): Promise<Area>;
  softDelete(id: string): Promise<boolean>;
}
