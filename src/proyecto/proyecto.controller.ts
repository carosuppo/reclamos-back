import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { CreateProyectoDto } from './dto/create-proyecto.dto';
import { UpdateProyectoDto } from './dto/update-proyecto.dto';
import {
  SwaggerCreateProyecto,
  SwaggerFindAllProyecto,
  SwaggerFindOneProyecto,
  SwaggerUpdateProyecto,
  SwaggerDeleteProyecto,
  SwaggerFindByTipoProyecto,
} from './swagger/proyecto.swagger';

@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly service: ProyectoService) {}

  @SwaggerCreateProyecto()
  @Post()
  create(@Body() createProyectoDto: CreateProyectoDto) {
    return this.service.create(createProyectoDto);
  }

  @SwaggerFindAllProyecto()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @SwaggerFindOneProyecto()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @SwaggerFindByTipoProyecto()
  @Get('tipo-proyecto/:id')
  findByTipoProyecto(@Param('id') id: string) {
    return this.service.findByTipoProyecto(id);
  }

  @SwaggerUpdateProyecto()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProyectoDto: UpdateProyectoDto,
  ) {
    return this.service.update(id, updateProyectoDto);
  }

  @SwaggerDeleteProyecto()
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
