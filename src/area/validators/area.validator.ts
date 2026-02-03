import { Inject } from '@nestjs/common';
import type { IAreaRepository } from '../repositories/area.repository.interface';

export class AreaValidator {
  constructor(
    @Inject('IAreaRepository')
    private readonly repository: IAreaRepository,
  ) {}
  async validate(id: string): Promise<void> {
    const area = await this.repository.findById(id);
    if (!area) {
      throw new Error(`Area con ID ${id} no encontrado.`);
    }
  }
}
