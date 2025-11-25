import { Controller, Get, Param } from '@nestjs/common';
import { TipoProyectoService } from './tipo-proyecto.service';
import {
  SwaggerFindAllTipoProyecto,
  SwaggerFindOneTipoProyecto,
} from './swagger/tipo-proyecto.swagger';

@Controller('tipo-proyecto')
export class TipoProyectoController {
  constructor(private readonly service: TipoProyectoService) {}

  @SwaggerFindAllTipoProyecto()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @SwaggerFindOneTipoProyecto()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
