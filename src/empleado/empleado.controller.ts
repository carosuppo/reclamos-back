import { Controller, Body, UseGuards, Put, Req } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateEmpleadoDto } from './dto/update.empleado.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/common/types/authenticated-request';

@ApiTags('Empleado')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('EMPLEADO')
@Controller('empleado')
export class EmpleadoController {
  constructor(private readonly empleadoService: EmpleadoService) {}

  @Put('update')
  @ApiOperation({ summary: 'Actualizar perfil del empleado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil actualizado correctamente',
    type: UpdateEmpleadoDto,
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado',
  })
  @ApiResponse({
    status: 403,
    description: 'No permitido para este rol',
  })
  updateProfile(
    @Body() dto: UpdateEmpleadoDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.empleadoService.update(userId, dto);
  }
}
