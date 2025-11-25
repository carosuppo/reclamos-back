import { CreateProyectoDto } from '../dto/create-proyecto.dto';
import { UpdateProyectoDto } from '../dto/update-proyecto.dto';
import { Proyecto } from '@prisma/client';

export interface IProyectoRepository {
  findAll(): Promise<Proyecto[]>;
  findOne(id: string): Promise<Proyecto | null>;
  findByTipoProyecto(tipoProyectoId: string): Promise<Proyecto[]>;
  create(createProyectoDto: CreateProyectoDto): Promise<Proyecto>;
  update(id: string, updateProyectoDto: UpdateProyectoDto): Promise<Proyecto>;
  remove(id: string): Promise<boolean>;
}
