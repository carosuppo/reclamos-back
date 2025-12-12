import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ReclamoService } from './reclamo.service';
import { CreateReclamoDto } from './dtos/create-reclamo.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reclamo')
export class ReclamoController {
  constructor(private readonly reclamoService: ReclamoService) {}

  @Roles(Role.CLIENTE)
  @Post()
  create(@Body() dto: CreateReclamoDto, @Req() req) {
    const userId = req.user.sub as string;
    return this.reclamoService.create(dto, userId);
  }

  /*@Roles(Role.EMPLEADO)
  @Get()
  getReclamosPorArea() {
    return this.reclamoService.reclamosPorArea();
  }

  @Roles(Role.EMPLEADO)
  @Get('/cliente/:id')
  findByCliente(@Param('id') clienteId: string) {
    return this.reclamoService.findByCliente(clienteId);
  }

  @Roles(Role.EMPLEADO)
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.reclamoService.findById(id);
  }

  @Roles(Role.EMPLEADO)
  @Get('/area/:id')
  findByArea(@Param('id') areaId: string) {
    return this.reclamoService.findByArea(areaId);
  }

  @Roles(Role.EMPLEADO)
  @Put('/:id')
  reassignArea(@Param('id') areaId: string, @Req() req) {
    const userId = req.user.sub as string;
    return this.reclamoService.reassignArea(areaId, userId);
  }

  @Roles(Role.CLIENTE)
  @Put('/:id')
  update(
    @Param('id') reclamoId: string,
    @Body() dto: UpdateReclamoDto,
    @Req() req) {
    const userId = req.user.sub as string;
    return this.reclamoService.modify(areaId);
  }

  @Roles(Role.EMPLEADO)
  @Put('/:id')
  updateEstado(@Param('id') reclamoId: string, @Req() req) {
    const userId = req.user.sub as string;
    return this.reclamoService.updateEstado(reclamoId, userId);
  }*/
}
