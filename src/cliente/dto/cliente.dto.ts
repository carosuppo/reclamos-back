import { Role } from '@prisma/client';

export class ClienteDto {
  id: string;
  email: string;
  telefono: string;
  nombre: string;
  role: Role;
  contraseña: string;
}
