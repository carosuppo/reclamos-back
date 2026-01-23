import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Param,
  Get,
  Query,
} from '@nestjs/common';
import { ReclamoService } from './reclamo.service';
import { CreateReclamoDto } from './dtos/create-reclamo.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateEstadoDto } from './dtos/update-estado.dto';
import { ReasignarAreaDto } from './dtos/reasignar-area.dto';
import { UpdateReclamoDto } from './dtos/update-reclamo.dto';
import { FindReclamoDto } from './dtos/find-reclamo.dto';
import {
  SwaggerCantidadPromedioResolucion,
  SwaggerCreateReclamo,
  SwaggerFindReclamosByArea,
  SwaggerFindReclamosByCliente,
  SwaggerFindReclamosByFiltros,
  SwaggerReassignAreaReclamo,
  SwaggerTiempoPromedioResolucion,
  SwaggerUpdateEstadoReclamo,
  SwaggerUpdateReclamo,
} from './swaggers/reclamo.swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reclamo')
export class ReclamoController {
  constructor(private readonly service: ReclamoService) {}

  @SwaggerCreateReclamo()
  @SwaggerCreateReclamo()
  @Roles(Role.CLIENTE)
  @Post()
  create(@Body() dto: CreateReclamoDto, @Req() req) {
    const userId = req.user.id as string;
    return this.service.create(dto, userId);
  }

  @SwaggerFindReclamosByCliente()
  @SwaggerFindReclamosByCliente()
  @Roles(Role.CLIENTE)
  @Get()
  findByCliente(@Req() req) {
    const userId = req.user.id as string;
    return this.service.findByCliente(userId);
  }

  @SwaggerUpdateEstadoReclamo()
  @SwaggerUpdateEstadoReclamo()
  @Roles(Role.EMPLEADO)
  @Put('/update-estado/:id')
  updateEstado(
    @Param('id') id: string,
    @Body() dto: UpdateEstadoDto,
    @Req() req,
  ) {
    const userId = req.user.id as string;
    return this.service.updateEstado(id, dto, userId);
  }

  @SwaggerReassignAreaReclamo()
  @SwaggerReassignAreaReclamo()
  @Roles(Role.EMPLEADO)
  @Put('/reassign-area/:id')
  reassignArea(
    @Param('id') reclamoId: string,
    @Body() dto: ReasignarAreaDto,
    @Req() req,
  ) {
    const userId = req.user.id as string;
    return this.service.reassignArea(reclamoId, dto, userId);
  }

  @SwaggerUpdateReclamo()
  @SwaggerUpdateReclamo()
  @Roles(Role.CLIENTE)
  @Put('/:id')
  update(
    @Param('id') reclamoId: string,
    @Body() dto: UpdateReclamoDto,
    @Req() req,
  ) {
    const userId = req.user.id as string;
    return this.service.update(reclamoId, dto, userId);
  }

  @SwaggerFindReclamosByArea()
  @SwaggerFindReclamosByArea()
  @Roles(Role.EMPLEADO)
  @Get('area')
  findByArea(@Req() req) {
    const userId = req.user.id as string;
    return this.service.findByArea(userId);
  }

  @Get(':id')
  findById(@Param('id') reclamoId: string) {
    return this.service.findById(reclamoId);
  }

  @SwaggerFindReclamosByFiltros()
  @Roles(Role.EMPLEADO)
  @Get('filtros')
  findByFiltros(@Query() dto: FindReclamoDto) {
    return this.service.findByFiltros(dto);
  }

  @SwaggerTiempoPromedioResolucion()
  @Roles(Role.EMPLEADO)
  @Get('tiempo-promedio-resolucion')
  getTiempoPromedioResolucion(@Query('areaId') areaId: string) {
    return this.service.getTiempoPromedioResolucion(areaId);
  }

  @SwaggerCantidadPromedioResolucion()
  @Roles(Role.EMPLEADO)
  @Get('cantidad-promedio-resolucion')
  getCantidadPromedioResolucion(@Query('areaId') areaId: string) {
    return this.service.getCantidadPromedioResolucion(areaId);
  }
}
