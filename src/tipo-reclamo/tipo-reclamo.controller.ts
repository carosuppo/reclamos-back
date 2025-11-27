import { Controller, Get, Param } from '@nestjs/common';
import { TipoReclamoService } from './tipo-reclamo.service';

@Controller('tipo-reclamo')
export class TipoReclamoController {
  constructor(private readonly tipoReclamoService: TipoReclamoService) {}

  @Get()
  findAll() {
    return this.tipoReclamoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoReclamoService.findOne(id);
  }
}
