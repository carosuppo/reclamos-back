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
import { ClienteService } from './cliente.service';
import { ClienteDTO } from './dtos/cliente.dto';
import { UpdateClienteDTO } from './dtos/update.cliente.dto';
import { MailPipe } from '../common/pipes/mail.pipe';

@UseGuards(JwtAuthGuard, RolesGuard) // Sólo para usuarios autenticados
@ApiTags('Cliente')
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @SwaggerUpdate('Cliente', UpdateClienteDTO) // Nombre del controlador, bodyDTO
  @Roles(Role.CLIENTE) // Sólo para clientes
  @Patch()
  updateProfile(
    @Body() dto: UpdateClienteDTO,
    @CurrentUser() user: string,
  ): Promise<boolean> {
    return this.clienteService.update(user, dto);
  }

  @SwaggerFindById('Cliente', ClienteDTO) // Nombre del controlador, Retorno
  @Get('me/:mail')
  me(@Param('mail', MailPipe) mail: string): Promise<ClienteDTO> {
    return this.clienteService.findByEmail(mail);
  }
}
