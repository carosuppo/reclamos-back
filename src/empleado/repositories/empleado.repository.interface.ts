import { Empleado } from '@prisma/client';
import { UsuarioCreateData } from 'src/common/interfaces/usuario-create.interface';
import { EmpleadoUpdateData } from '../interfaces/empleado-update.interface';

export interface IEmpleadoRepository {
  create(data: UsuarioCreateData): Promise<Empleado>;
  findAll(): Promise<Empleado[]>;
  findByEmail(email: string): Promise<Empleado | null>;
  findById(id: string): Promise<Empleado | null>;
  update(id: string, data: EmpleadoUpdateData): Promise<Empleado>;
  softDelete(id: string): Promise<void>;
}
