import {
  Controller,
  Body,
  UseGuards,
  Put,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UpdateClienteDto } from './dtos/update.cliente.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import type { AuthenticatedRequest } from 'src/common/types/authenticated-request';
import { SwaggerUpdateCliente } from './swaggers/cliente.swagger';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENTE')
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @SwaggerUpdateCliente()
  @Put('update')
  updateProfile(
    @Body() dto: UpdateClienteDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.clienteService.update(userId, dto);
  }

  @Get('me/:mail')
  me(@Param('mail') mail: string) {
    return this.clienteService.findOne(mail);
  }
}
