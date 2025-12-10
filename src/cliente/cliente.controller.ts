import { Controller, Body, UseGuards, Put, Req } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UpdateClienteDto } from './dto/update.cliente.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { AuthenticatedRequest } from 'src/common/types/authenticated-request';

@ApiTags('Cliente')
@ApiBearerAuth() // Swagger muestra el candadito para meter el token
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENTE')
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Put('update')
  @ApiOperation({ summary: 'Actualizar los datos del cliente autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Datos del cliente actualizados',
    type: UpdateClienteDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en la solicitud',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado. Falta o es inválido el token.',
  })
  updateProfile(
    @Body() dto: UpdateClienteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.clienteService.update(userId, dto);
  }
}
