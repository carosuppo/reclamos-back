import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TipoProyectoService } from './tipo-proyecto.service';
import {
  SwaggerFindAllTipoProyecto,
  SwaggerFindOneTipoProyecto,
} from './swaggers/tipo-proyecto.swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';

@UseGuards(JwtAuthGuard)
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
