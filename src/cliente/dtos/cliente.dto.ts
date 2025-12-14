import {
  ClienteEmailField,
  ClienteIdField,
  ClienteNombreField,
  ClienteTelefonoField,
} from '../swaggers/cliente.dto.swagger';

export class ClienteDto {
  @ClienteIdField()
  id: string;

  @ClienteEmailField()
  email: string;

  @ClienteTelefonoField()
  telefono: string;

  @ClienteNombreField()
  nombre: string;
}
