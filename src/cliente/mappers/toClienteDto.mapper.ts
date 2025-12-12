import { Cliente } from '@prisma/client';
import { ClienteDto } from '../dtos/cliente.dto';

export function toClienteDto(cliente: Cliente): ClienteDto {
  const dto: ClienteDto = {
    id: cliente.id,
    email: cliente.email,
    telefono: cliente.telefono,
    nombre: cliente.nombre,
  };
  return dto;
}
