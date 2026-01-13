import { Module } from '@nestjs/common';
import { AreaModule } from '../area/area.module';
import { CambioEstadoController } from './cambio-estado.controller';
import { CambioEstadoService } from './cambio-estado.service';
import { CambioEstadoRepository } from './repositories/cambio-estado.repository';

@Module({
  imports: [AreaModule],
  controllers: [CambioEstadoController],
  providers: [
    CambioEstadoService,
    { provide: 'ICambioEstadoRepository', useClass: CambioEstadoRepository },
  ],
  exports: [CambioEstadoService, 'ICambioEstadoRepository'],
})
export class CambioEstadoModule {}
