import { Module } from '@nestjs/common';
import { CambioEstadoService } from './cambio-estado.service';
import { CambioEstadoController } from './cambio-estado.controller';
import { AreaModule } from 'src/area/area.module';
import { CambioEstadoRepository } from './repositories/cambioEstado.repository';
import { CambioEstadoValidator } from './validators/cambio-estado.validator';

@Module({
  imports: [AreaModule],
  controllers: [CambioEstadoController],
  providers: [
    CambioEstadoService,
    CambioEstadoValidator,
    { provide: 'ICambioEstadoRepository', useClass: CambioEstadoRepository },
  ],
  exports: [CambioEstadoService, 'ICambioEstadoRepository'],
})
export class CambioEstadoModule {}
