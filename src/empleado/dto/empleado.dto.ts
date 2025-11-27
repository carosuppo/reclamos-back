import { Role } from '@prisma/client';

export class EmpleadoDto {
  id: string;
  email: string;
  telefono: string;
  nombre: string;
  role: Role;
}
