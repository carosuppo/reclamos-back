import { BadRequestException } from '@nestjs/common';
import { AreaService } from 'src/area/area.service';

export class CambioEstadoValidator {
  constructor(private readonly area: AreaService) {}

  async validateArea(id: string): Promise<boolean> {
    const existe = await this.area.findOne(id);
    if (!existe) {
      throw new BadRequestException('El area no existe.');
    }
    return true;
  }
}
