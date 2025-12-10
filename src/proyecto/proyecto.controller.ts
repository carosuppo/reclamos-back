import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
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
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly service: ProyectoService) {}

  @SwaggerCreateProyecto()
  @Post()
  @Roles(Role.CLIENTE)
  create(@Body() createProyectoDto: CreateProyectoDto, @Req() req) {
    const user = req.user.id as string;
    return this.service.create(createProyectoDto, user);
  }

  @SwaggerFindAllProyecto()
  @Get()
  findAll(@Req() req) {
    const user = req.user.id as string;
    return this.service.findAll(user);
  }

  @SwaggerFindOneProyecto()
  @Roles(Role.EMPLEADO, Role.CLIENTE)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @SwaggerFindByTipoProyecto()
  @Roles(Role.CLIENTE)
  @Get('tipo-proyecto/:id')
  findByTipoProyecto(@Param('id') id: string, @Req() req) {
    const user = req.user.id as string;
    return this.service.findByTipoProyecto(id, user);
  }

  @SwaggerUpdateProyecto()
  @Roles(Role.CLIENTE)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProyectoDto: UpdateProyectoDto,
    @Req() req,
  ) {
    const user = req.user.id as string;
    return this.service.update(id, updateProyectoDto, user);
  }

  @SwaggerDeleteProyecto()
  @Roles(Role.CLIENTE)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
