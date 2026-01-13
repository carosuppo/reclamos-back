import { Empleado } from '@prisma/client';
import {
  EmpleadoCreateData,
  EmpleadoUpdateData,
} from '../interfaces/empleado.interface';

export interface IEmpleadoRepository {
  create(data: EmpleadoCreateData): Promise<Empleado>;
  update(data: EmpleadoUpdateData): Promise<Empleado>;
  assignArea(id: string, area: string): Promise<Empleado>;
  findById(id: string): Promise<Empleado | null>;
  findByEmail(email: string): Promise<Empleado | null>;
  delete(id: string): Promise<void>;
}
