import { Empleado } from '@prisma/client';
import { EmpleadoUpdateData } from '../interfaces/empleado-update.interface';
import { EmpleadoCreateData } from '../interfaces/empleado-create.interface';

export interface IEmpleadoRepository {
  create(data: EmpleadoCreateData): Promise<Empleado>;
  findAll(): Promise<Empleado[]>;
  findByEmail(email: string): Promise<Empleado | null>;
  findById(id: string): Promise<Empleado | null>;
  update(id: string, data: EmpleadoUpdateData): Promise<Empleado>;
  softDelete(id: string): Promise<void>;
}
