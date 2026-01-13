import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  SwaggerFindAll,
  SwaggerFindById,
} from '../common/decorators/swaggers/controller.swagger';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ObjectIdPipe } from '../common/pipes/object-id.pipe';
import { TipoProyectoDTO } from './dtos/tipo-proyecto.dto';
import { TipoProyectoService } from './tipo-proyecto.service';

@UseGuards(JwtAuthGuard)
@ApiTags('Tipo de proyecto')
@Controller('tipo-proyecto')
export class TipoProyectoController {
  constructor(private readonly service: TipoProyectoService) {}

  @SwaggerFindAll('TipoProyecto', TipoProyectoDTO)
  @Get()
  findAll(): Promise<TipoProyectoDTO[]> {
    return this.service.findAll();
  }

  @SwaggerFindById('TipoProyecto', TipoProyectoDTO)
  @Get(':id')
  findById(@Param('id', ObjectIdPipe) id: string): Promise<TipoProyectoDTO> {
    return this.service.findById(id);
  }
}
