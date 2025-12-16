import { Module } from '@nestjs/common';
import { ReclamoService } from './reclamo.service';
import { ReclamoController } from './reclamo.controller';
import { ReclamoRepository } from './repositories/reclamo.repository';
import { CambioEstadoModule } from '../cambio-estado/cambio-estado.module';
import { TipoReclamoModule } from 'src/tipo-reclamo/tipo-reclamo.module';
import { ProyectoModule } from 'src/proyecto/proyecto.module';
import { ReclamoValidator } from './validators/reclamo.validator';
import { ReclamoHelper } from './helpers/reclamo.helper';
import { AreaModule } from 'src/area/area.module';
import { EmpleadoModule } from 'src/empleado/empleado.module';
import { AreaValidator } from './validators/area.validator';
import { ClienteModule } from 'src/cliente/cliente.module';

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
    AreaValidator,
    { provide: 'IReclamoRepository', useClass: ReclamoRepository },
  ],
})
export class ReclamoModule {}
