import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import {
  SwaggerCreate,
  SwaggerFindAll,
  SwaggerUpdate,
} from '../common/decorators/swaggers/controller.swagger';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ObjectIdPipe } from '../common/pipes/object-id.pipe';
import { CreateReclamoDTO } from './dtos/create-reclamo.dto';
import { FiltersDTO } from './dtos/filters.dto';
import { ReasignarAreaDTO } from './dtos/reasignar-area.dto';
import { ReclamoDTO } from './dtos/reclamo.dto';
import { UpdateEstadoDTO } from './dtos/update-estado.dto';
import { UpdateReclamoDTO } from './dtos/update-reclamo.dto';
import { ReclamoService } from './reclamo.service';
import { SwaggerCantProm, SwaggerTiemProm } from './swaggers/reclamo.swagger';

@UseGuards(JwtAuthGuard, RolesGuard) // Ingreso permitido sólo para usuarios autenticados
@ApiTags('Reclamo')
@Controller('reclamo')
export class ReclamoController {
  constructor(private readonly service: ReclamoService) {}

  @SwaggerCreate('Reclamo', CreateReclamoDTO, ReclamoDTO)
  @Roles(Role.CLIENTE) // Ingreso permitido sólo para clientes
  @Post()
  create(@Body() dto: CreateReclamoDTO, @CurrentUser() userId: string) {
    return this.service.create(dto, userId);
  }

  @SwaggerUpdate('Datos del reclamo', UpdateReclamoDTO, ReclamoDTO)
  @Roles(Role.CLIENTE) // Ingreso permitido sólo para clientes
  @Patch('/:id')
  update(
    @Param('id', ObjectIdPipe) id: string,
    @Body() dto: UpdateReclamoDTO,
    @CurrentUser() userId: string,
  ) {
    return this.service.update(id, dto, userId);
  }

  @SwaggerUpdate('Estado de Reclamo', UpdateEstadoDTO, ReclamoDTO)
  @Roles(Role.EMPLEADO) // Ingreso permitido sólo para empleados
  @Put('/change-estado/:id')
  changeEstado(
    @Param('id', ObjectIdPipe) id: string,
    @Body() dto: UpdateEstadoDTO,
    @CurrentUser() userId: string,
  ) {
    return this.service.changeEstado(id, dto, userId);
  }

  @SwaggerUpdate('Área de un reclamo', ReasignarAreaDTO, ReclamoDTO)
  @Roles(Role.EMPLEADO) // Ingreso permitido sólo para empleados
  @Put('/reassign-area/:id')
  reassignArea(
    @Param('id', ObjectIdPipe) id: string,
    @Body() dto: ReasignarAreaDTO,
    @CurrentUser() userId: string,
  ) {
    return this.service.reassignArea(id, dto, userId);
  }

  @SwaggerFindAll('Reclamos de cliente', ReclamoDTO)
  @Roles(Role.CLIENTE) // Ingreso permitido sólo para clientes
  @Get()
  findByCliente(@CurrentUser() userId: string) {
    return this.service.findByCliente(userId);
  }

  @SwaggerFindAll('Reclamos de un área', ReclamoDTO)
  @Roles(Role.EMPLEADO) // Ingreso permitido sólo para empleados
  @Get('area')
  findByArea(@CurrentUser() userId: string) {
    return this.service.findByArea(userId);
  }

  @SwaggerFindAll('Reclamos con filtros', ReclamoDTO)
  @Roles(Role.EMPLEADO) // Ingreso permitido sólo para empleados
  @Get('filtros')
  countByFiltros(@Query() dto: FiltersDTO) {
    return this.service.countByFiltros(dto);
  }

  @SwaggerTiemProm()
  @Roles(Role.EMPLEADO) // Ingreso permitido sólo para empleados
  @Get('tiempo-promedio-resolucion')
  getTiemProm(@Query('areaId', ObjectIdPipe) areaId: string) {
    return this.service.getTiemProm(areaId);
  }

  @SwaggerCantProm()
  @Roles(Role.EMPLEADO) // Ingreso permitido sólo para empleados
  @Get('cantidad-promedio-resolucion')
  getCantProm(@Query('areaId', ObjectIdPipe) areaId: string) {
    return this.service.getCantProm(areaId);
  }
}
