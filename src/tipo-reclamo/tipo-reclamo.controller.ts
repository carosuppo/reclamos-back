import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  SwaggerFindAll,
  SwaggerFindById,
} from '../common/decorators/swaggers/controller.swagger';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { ObjectIdPipe } from '../common/pipes/object-id.pipe';
import { TipoReclamoDTO } from './dtos/tipo-reclamo.dto';
import { TipoReclamoService } from './tipo-reclamo.service';

@UseGuards(JwtAuthGuard) // Ingreso permitido sólo para usuarios autenticados
@ApiTags('Tipo de reclamo')
@Controller('tipo-reclamo')
export class TipoReclamoController {
  constructor(private readonly service: TipoReclamoService) {}

  @SwaggerFindAll('TipoReclamo', TipoReclamoDTO)
  @Get()
  findAll(): Promise<TipoReclamoDTO[]> {
    return this.service.findAll();
  }

  @SwaggerFindById('TipoReclamo', TipoReclamoDTO)
  @Get(':id')
  findById(@Param('id', ObjectIdPipe) id: string): Promise<TipoReclamoDTO> {
    return this.service.findById(id);
  }
}
