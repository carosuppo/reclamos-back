import { ValidatorConstraint } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { TipoProyectoService } from '../../tipo-proyecto/tipo-proyecto.service';

@ValidatorConstraint({ async: true })
@Injectable()
export class ProyectoValidador {
  constructor(private readonly service: TipoProyectoService) {}

  async validateTipoProyecto(tipoProyectoId: string): Promise<boolean> {
    await this.service.findOne(tipoProyectoId); // findOne tira NotFoundException si no existe
    return true;
  }
}
