import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import {
  SwaggerFindById,
  SwaggerUpdate,
} from '../common/decorators/swaggers/controller.swagger';
import { CurrentUser } from '../common/decorators/user.decorator';
import { Role } from '../common/enums/role.enum';
import { JwtAuthGuard } from '../common/guards/jwt.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { MailPipe } from '../common/pipes/mail.pipe';
import { ObjectIdPipe } from '../common/pipes/object-id.pipe';
import { AsignarAreaDTO } from './dtos/asignar-area.dto';
import { EmpleadoDTO } from './dtos/empleado.dto';
import { UpdateEmpleadoDTO } from './dtos/update-empleado.dto';
import { EmpleadoService } from './empleado.service';
import { SwaggerAssignArea } from './swaggers/empleado.swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.EMPLEADO) // Sólo para empleados
@ApiTags('Empleado')
@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly service: EmpleadoService) {}

  @SwaggerUpdate('Empleado', UpdateEmpleadoDTO) // Nombre del endpoint, body
  @Patch()
  updateProfile(
    @Body() dto: UpdateEmpleadoDTO,
    @CurrentUser() user: string,
  ): Promise<boolean> {
    return this.service.update(user, dto);
  }

  @SwaggerAssignArea()
  @Patch(':id/area')
  assignArea(
    @Param('id', ObjectIdPipe) id: string,
    @Body() dto: AsignarAreaDTO,
  ): Promise<boolean> {
    return this.service.assignArea(id, dto);
  }

  @SwaggerFindById('Empleado', EmpleadoDTO) // Nombre del endpoint, body
  @Get('me/:mail')
  me(@Param('mail', MailPipe) mail: string): Promise<EmpleadoDTO> {
    return this.service.findByEmail(mail);
  }
}
