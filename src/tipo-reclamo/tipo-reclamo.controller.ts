import { Controller, Get, Param } from '@nestjs/common';
import { TipoReclamoService } from './tipo-reclamo.service';
import {
  SwaggerFindAllTipoReclamo,
  SwaggerFindOneTipoReclamo,
} from './swaggers/tipo-reclamo.swagger';

@Controller('tipo-reclamo')
export class TipoReclamoController {
  constructor(private readonly tipoReclamoService: TipoReclamoService) {}

  @SwaggerFindAllTipoReclamo()
  @Get()
  findAll() {
    return this.tipoReclamoService.findAll();
  }

  @SwaggerFindOneTipoReclamo()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoReclamoService.findOne(id);
  }
}
