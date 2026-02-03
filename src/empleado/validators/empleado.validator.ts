import { Inject } from '@nestjs/common';
import type { IEmpleadoRepository } from '../repositories/empleado.repository.interface';

export class EmpleadoValidator {
  constructor(
    @Inject('IEmpleadoRepository')
    private readonly repository: IEmpleadoRepository,
  ) {}

  async validate(id: string) {
    const empleado = await this.repository.findById(id);
    if (!empleado) {
      throw new Error(`Empleado con ID ${id} no encontrado.`);
    }
  }

  async validateByEmail(email: string) {
    const empleado = await this.repository.findByEmail(email);
    if (empleado) {
      throw new Error(`Empleado con email ${email} ya registrado.`);
    }
  }
}
