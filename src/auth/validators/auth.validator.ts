import { Injectable } from '@nestjs/common';
import { ClienteValidator } from '../../cliente/validators/cliente.validator';
import { EmpleadoValidator } from '../../empleado/validators/empleado.validator';

@Injectable()
export class AuthValidator {
  constructor(
    private readonly clienteValidator: ClienteValidator,
    private readonly empleadoValidator: EmpleadoValidator,
  ) {}

  async validateEmail(email: string): Promise<void> {
    await this.empleadoValidator.validateByEmail(email);
    await this.clienteValidator.validateByEmail(email);
  }
}
