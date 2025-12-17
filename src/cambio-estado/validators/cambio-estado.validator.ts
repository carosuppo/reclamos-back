import { Injectable, NotFoundException } from '@nestjs/common';
import { AreaService } from 'src/area/area.service';

@Injectable()
export class CambioEstadoValidator {
  constructor(private readonly area: AreaService) {}

  async validateArea(id: string): Promise<boolean> {
    const existe = await this.area.findOne(id);
    if (!existe) {
      throw new NotFoundException('El area no existe.');
    }
    return true;
  }
}
