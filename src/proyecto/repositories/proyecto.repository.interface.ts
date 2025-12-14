import { CreateProyectoDto } from '../dtos/create-proyecto.dto';
import { UpdateProyectoDto } from '../dtos/update-proyecto.dto';
import { Proyecto } from '@prisma/client';

export interface IProyectoRepository {
  findAll(user: string): Promise<Proyecto[]>;
  findOne(id: string): Promise<Proyecto | null>;
  findByTipoProyecto(tipoProyectoId: string, user: string): Promise<Proyecto[]>;
  create(createProyectoDto: CreateProyectoDto): Promise<Proyecto>;
  update(id: string, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto>;
  remove(id: string): Promise<boolean>;
}
