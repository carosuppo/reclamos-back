import { Module } from '@nestjs/common';
import { TipoReclamoService } from './tipo-reclamo.service';
import { TipoReclamoController } from './tipo-reclamo.controller';
import { TipoReclamoRepository } from './repository/tipo-reclamo.repository';

@Module({
  controllers: [TipoReclamoController],
  providers: [
    TipoReclamoService,
    {
      provide: 'ITipoReclamoRepository',
      useClass: TipoReclamoRepository,
    },
  ],
})
export class TipoReclamoModule {}
