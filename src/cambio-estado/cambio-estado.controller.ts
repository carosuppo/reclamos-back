import { Body, Controller, Get, Param } from '@nestjs/common';
import { CambioEstadoService } from './cambio-estado.service';

@Controller('cambio-estado')
export class CambioEstadoController {
  constructor(private readonly cambioEstadoService: CambioEstadoService) {}

  @Get(':id')
  findByReclamo(@Param('id') id: string) {
    return this.cambioEstadoService.findByReclamo(id);
  }

  @Get('/estado/:estado')
  findByEstado(@Param('estado') estado: string) {
    return this.cambioEstadoService.findByEstado(estado);
  }
}
