import { Module } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { ClienteRepository } from './repositories/cliente.repository';
import { ClienteValidator } from './validators/cliente.validator';

@Module({
  imports: [],
  controllers: [ClienteController],
  providers: [
    ClienteService,
    ClienteRepository,
    ClienteValidator,
    { provide: 'IClienteRepository', useClass: ClienteRepository },
  ],
  exports: [ClienteService, ClienteValidator],
})
export class ClienteModule {}
