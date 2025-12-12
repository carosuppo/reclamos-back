import { Module } from '@nestjs/common';
import { ReclamoService } from './reclamo.service';
import { ReclamoController } from './reclamo.controller';
import { ReclamoRepository } from './repositories/reclamo.repository';
import { CambioEstadoModule } from 'src/cambio-estado/cambio-estado.module';
import { TipoReclamoModule } from 'src/tipo-reclamo/tipo-reclamo.module';
import { ProyectoModule } from 'src/proyecto/proyecto.module';
import { ReclamoValidator } from './validators/reclamo.validator';

@Module({
  imports: [TipoReclamoModule, CambioEstadoModule, ProyectoModule],
  controllers: [ReclamoController],
  providers: [
    ReclamoService,
    ReclamoValidator,
    { provide: 'IReclamoRepository', useClass: ReclamoRepository },
  ],
})
export class ReclamoModule {}
