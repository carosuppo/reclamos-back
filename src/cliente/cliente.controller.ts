import { Controller, Body, UseGuards, Put, Req } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { UpdateClienteDto } from './dto/update.cliente.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('CLIENTE')
@Controller('cliente')
export class ClienteController {
  constructor(private readonly clienteService: ClienteService) {}

  @Put('update')
  update(@Body() dto: UpdateClienteDto, @Req() req) {
    const userId = req.user.id;
    return this.clienteService.update(userId, dto);
  }
}
