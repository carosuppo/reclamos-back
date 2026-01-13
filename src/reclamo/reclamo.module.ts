import { Module } from '@nestjs/common';
import { AreaModule } from '../area/area.module';
import { CambioEstadoModule } from '../cambio-estado/cambio-estado.module';
import { ClienteModule } from '../cliente/cliente.module';
import { EmpleadoModule } from '../empleado/empleado.module';
import { ProyectoModule } from '../proyecto/proyecto.module';
import { TipoReclamoModule } from '../tipo-reclamo/tipo-reclamo.module';
import { ReclamoHelper } from './helpers/reclamo.helper';
import { ReclamoController } from './reclamo.controller';
import { ReclamoService } from './reclamo.service';
import { ReclamoRepository } from './repositories/reclamo.repository';
import { ReclamoValidator } from './validators/reclamo.validator';

@Module({
  imports: [
    TipoReclamoModule,
    CambioEstadoModule,
    ProyectoModule,
    AreaModule,
    EmpleadoModule,
    ClienteModule,
  ],
  controllers: [ReclamoController],
  providers: [
    ReclamoService,
    ReclamoValidator,
    ReclamoHelper,
    { provide: 'IReclamoRepository', useClass: ReclamoRepository },
  ],
})
export class ReclamoModule {}
