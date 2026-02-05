import { Proyecto } from '@prisma/client';
import {
  ProyectoCreateData,
  ProyectoUpdateData,
} from '../interfaces/proyecto.interface';

export interface IProyectoRepository {
  create(data: ProyectoCreateData): Promise<Proyecto>;
  update(data: ProyectoUpdateData): Promise<Proyecto>;
  findById(id: string): Promise<Proyecto | null>;
  findAll(user: string): Promise<Proyecto[]>;
  findByTipoProyecto(tipoProyectoId: string, user: string): Promise<Proyecto[]>;
  delete(id: string): Promise<Proyecto>;
}
