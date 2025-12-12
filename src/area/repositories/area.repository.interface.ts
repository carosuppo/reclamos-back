import { CreateAreaDto } from '../dtos/create-area.dto';
import { UpdateAreaDto } from '../dtos/update-area.dto';
import { Area } from '@prisma/client';

export interface IAreaRepository {
  create(data: CreateAreaDto): Promise<Area>;
  update(nombre: string, data: UpdateAreaDto): Promise<Area>;
  findAll(): Promise<Area[]>;
  findById(nombre: string): Promise<Area>;
  findByName(nombre: string): Promise<Area>;
  softDelete(nombre: string): Promise<boolean>;
}
