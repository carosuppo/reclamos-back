import { ProyectoService } from 'src/proyecto/proyecto.service';
import { TipoReclamoService } from '../../tipo-reclamo/tipo-reclamo.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReclamoValidator {
  constructor(
    private readonly tipoReclamoService: TipoReclamoService,
    private readonly proyectoService: ProyectoService,
  ) {}

  async validateTipoReclamo(id: string): Promise<boolean> {
    const tipoReclamo = await this.tipoReclamoService.findOne(id);
    if (!tipoReclamo)
      throw new Error(`El tipo de reclamo con id ${id} no existe`);
    return true;
  }

  async validateProyecto(id: string): Promise<boolean> {
    await this.proyectoService.findOne(id);
    return true;
  }
}
