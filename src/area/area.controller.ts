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
import { ApiTags, PartialType } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import {
  SwaggerCreate,
  SwaggerDelete,
  SwaggerFindAll,
  SwaggerFindById,
  SwaggerUpdate,
} from '../common/decorators/swaggers/controller.swagger';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ObjectIdPipe } from '../common/pipes/object-id.pipe';
import { AreaService } from './area.service';
import { AreaDTO } from './dtos/area.dto';
import { CreateAreaDTO, UpdateAreaDTO } from './dtos/create-area.dto';

@UseGuards(JwtAuthGuard, RolesGuard) // Sólo pueden ingresar usuarios autenticados
@ApiTags('Área')
@Controller('area')
export class AreaController {
  constructor(private readonly service: AreaService) {}

  @SwaggerCreate('Área', CreateAreaDTO, AreaDTO)
  @Roles(Role.EMPLEADO) // Sólo pueden ingresar empleados
  @Post()
  create(@Body() dto: CreateAreaDTO): Promise<boolean> {
    return this.service.create(dto);
  }

  @SwaggerFindAll('Área', AreaDTO)
  @Get()
  findAll(): Promise<AreaDTO[]> {
    return this.service.findAll();
  }

  @SwaggerFindById('Área', AreaDTO)
  @Get(':id')
  findById(@Param('id', ObjectIdPipe) id: string): Promise<AreaDTO> {
    // Valida que el id sea válido antes de pasarlo al servicio
    return this.service.findById(id);
  }

  @SwaggerUpdate('Área', PartialType(CreateAreaDTO), AreaDTO)
  @Roles(Role.EMPLEADO) // Sólo pueden ingresar empleados
  @Patch(':id')
  update(
    @Param('id', ObjectIdPipe) id: string,
    @Body() dto: UpdateAreaDTO,
  ): Promise<boolean> {
    return this.service.update(id, dto);
  }

  @SwaggerDelete('Área')
  @Roles(Role.EMPLEADO) // Sólo pueden ingresar empleados
  @Delete(':id')
  delete(@Param('id', ObjectIdPipe) id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}
