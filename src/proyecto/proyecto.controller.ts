import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import {
  SwaggerCreate,
  SwaggerFindAll,
  SwaggerFindById,
  SwaggerUpdate,
} from '../common/decorators/swaggers/controller.swagger';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ObjectIdPipe } from '../common/pipes/object-id.pipe';
import {
  CreateProyectoDTO,
  UpdateProyectoDTO,
} from './dtos/create-proyecto.dto';
import { ProyectoDTO } from './dtos/proyecto.dto';
import { ProyectoService } from './proyecto.service';

@UseGuards(JwtAuthGuard, RolesGuard) // Sólo para usuarios autenticados
@ApiTags('Proyecto')
@Controller('proyecto')
export class ProyectoController {
  constructor(private readonly service: ProyectoService) {}

  @SwaggerCreate('Proyecto', CreateProyectoDTO, ProyectoDTO) // Nombre de la tabla, bodyDTO, Retorno
  @Post()
  @Roles(Role.CLIENTE) // Sólo para clientes
  create(
    @Body() dto: CreateProyectoDTO,
    @CurrentUser() user: string,
  ): Promise<boolean> {
    return this.service.create(dto, user);
  }

  @SwaggerUpdate('Proyecto', UpdateProyectoDTO, ProyectoDTO) // Nombre de la tabla, bodyDTO, Retorno
  @Roles(Role.CLIENTE) // Sólo para clientes
  @Patch(':id')
  update(
    @Param('id', ObjectIdPipe) id: string,
    @Body() dto: UpdateProyectoDTO,
  ): Promise<boolean> {
    return this.service.update(id, dto);
  }

  @SwaggerFindAll('Proyecto', ProyectoDTO) // Nombre de la tabla, Retorno
  @Get()
  findAll(@CurrentUser() user: string): Promise<ProyectoDTO[]> {
    return this.service.findAll(user);
  }

  @SwaggerFindById('Proyecto', ProyectoDTO) // Nombre de la tabla, Retorno
  @Get(':id')
  findById(@Param('id', ObjectIdPipe) id: string): Promise<ProyectoDTO> {
    return this.service.findById(id);
  }

  @SwaggerFindAll('Proyecto', ProyectoDTO) // Nombre de la tabla, Retorno
  @Get('tipo-proyecto/:id')
  findByTipoProyecto(
    @Param('id', ObjectIdPipe) id: string,
    @CurrentUser() user: string,
  ): Promise<ProyectoDTO[]> {
    return this.service.findByTipoProyecto(id, user);
  }

  @SwaggerCreate('Proyecto', CreateProyectoDTO, ProyectoDTO) // Nombre de la tabla, bodyDTO, Retorno
  @Roles(Role.CLIENTE) // Sólo para clientes
  @Delete(':id')
  delete(@Param('id', ObjectIdPipe) id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}
