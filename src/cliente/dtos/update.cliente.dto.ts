import {
  ClienteEmailField,
  ClienteNombreField,
  ClienteTelefonoField,
} from '../swaggers/cliente.dto.swagger';

export class UpdateClienteDto {
  @ClienteEmailField()
  email?: string;

  @ClienteNombreField()
  nombre?: string;

  @ClienteTelefonoField()
  telefono?: string;
}
