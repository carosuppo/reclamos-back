import { Module } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ClienteController } from './cliente.controller';
import { ClienteRepository } from './repositories/cliente.repository';

@Module({
  imports: [],
  controllers: [ClienteController],
  providers: [ClienteService, ClienteRepository],
  exports: [ClienteService],
})
export class ClienteModule {}
