import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Estados } from '@prisma/client';
import { Roles } from '../common/decorators/roles.decorator';
import { SwaggerFindAll } from '../common/decorators/swaggers/controller.swagger';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { ObjectIdPipe } from '../common/pipes/object-id.pipe';
import { TransformEstadoPipe } from '../common/pipes/transform-estado.pipe';
import { CambioEstadoService } from './cambio-estado.service';
import { CambioEstadoDTO } from './dtos/cambio-estado.dto';

@UseGuards(JwtAuthGuard, RolesGuard) // Sólo pueden ingresar los usuarios autenticados
@ApiTags('Cambio de estado')
@Controller('cambio-estado')
export class CambioEstadoController {
  constructor(private readonly service: CambioEstadoService) {}

  @SwaggerFindAll('Cambio de estado de un reclamo', CambioEstadoDTO) // Nombre del endpoint y DTO de respuesta
  @Get(':id')
  findByReclamo(
    @Param('id', ObjectIdPipe) id: string,
  ): Promise<CambioEstadoDTO[]> {
    return this.service.findByReclamo(id);
  }

  @SwaggerFindAll('Cambio de estado por estado', CambioEstadoDTO) // Nombre del endpoint y DTO de respuesta
  @Roles(Role.EMPLEADO) // Sólo pueden ingresar los empleados
  @Get('/estado/:estado')
  findByEstado(
    @Param('estado', TransformEstadoPipe) estado: Estados, // Transforma el string a un enum
  ): Promise<CambioEstadoDTO[]> {
    return this.service.findByEstado(estado);
  }
}
