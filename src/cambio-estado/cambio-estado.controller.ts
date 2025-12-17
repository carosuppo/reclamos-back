import { Controller, Get, Param } from '@nestjs/common';
import { Controller, Get, Param } from '@nestjs/common';
import { CambioEstadoService } from './cambio-estado.service';
import {
  SwaggerFindCambioEstadoByEstado,
  SwaggerFindCambioEstadoByReclamo,
} from './swaggers/cambio-estado.swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('cambio-estado')
export class CambioEstadoController {
  constructor(private readonly cambioEstadoService: CambioEstadoService) {}

  @SwaggerFindCambioEstadoByReclamo()
  @SwaggerFindCambioEstadoByReclamo()
  @Get(':id')
  findByReclamo(@Param('id') id: string) {
    return this.cambioEstadoService.findByReclamo(id);
  }

  @SwaggerFindCambioEstadoByEstado()
  @SwaggerFindCambioEstadoByEstado()
  @Get('/estado/:estado')
  findByEstado(@Param('estado') estado: string) {
    return this.cambioEstadoService.findByEstado(estado);
  }
}
