import { Inject, Injectable } from '@nestjs/common';
import type { IClienteRepository } from '../repositories/cliente.repository.interface';

@Injectable()
export class ClienteValidator {
  constructor(
    @Inject('IClienteRepository')
    private readonly repository: IClienteRepository,
  ) {}

  async validateUpdate(id: string, email?: string): Promise<boolean> {
    await this.repository.findById(id);
    if (email) {
      await this.repository.findByEmail(email);
    }
    return true;
  }

  async validateByEmail(id: string) {
    const cliente = await this.repository.findByEmail(id);
    if (cliente) {
      throw new Error(`Cliente con ID ${id} ya registrado.`);
    }
  }
}
