import { CreateAreaDto } from '../dto/create-area.dto';
import { UpdateAreaDto } from '../dto/update-area.dto';
import { Area } from '@prisma/client';

export interface IAreaRepository {
  create(data: CreateAreaDto): Promise<Area>;
  update(nombre: string, data: UpdateAreaDto): Promise<Area>;
  findAll(): Promise<Area[]>;
  findById(nombre: string): Promise<Area>;
  softDelete(nombre: string): Promise<boolean>;
}
