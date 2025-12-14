import { UpdateClienteDto } from '../dtos/update.cliente.dto';
import { ClienteUpdateData } from '../interfaces/cliente-update.interface';

export function toClienteUpdateData(dto: UpdateClienteDto): ClienteUpdateData {
  return {
    email: dto.email,
    nombre: dto.nombre,
    telefono: dto.telefono,
  };
}
