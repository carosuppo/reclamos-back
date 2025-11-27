import { Controller, Body, UseGuards, Put, Req } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateEmpleadoDto } from './dto/update.empleado.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('EMPLEADO')
@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Put('update')
  updateProfile(@Body() dto: UpdateEmpleadoDto, @Req() req) {
    const userId = req.user.id;
    return this.empleadoService.update(userId, dto);
  }
}
