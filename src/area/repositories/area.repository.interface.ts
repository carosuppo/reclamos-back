import { Area } from '@prisma/client';
import { areaCreateData, areaUpdateData } from '../interfaces/area.interface';

export interface IAreaRepository {
  create(data: areaCreateData): Promise<Area>;
  update(data: areaUpdateData): Promise<Area>;
  findAll(): Promise<Area[]>;
  findById(id: string): Promise<Area | null>;
  findByName(name: string): Promise<Area | null>;
  delete(id: string): Promise<Area>;
}
