import { Module } from '@nestjs/common';
import { TipoProyectoModule } from 'src/tipo-proyecto/tipo-proyecto.module';
import { ProyectoController } from './proyecto.controller';
import { ProyectoService } from './proyecto.service';
import { ProyectoRepository } from './repositories/proyecto.repository';

@Module({
  imports: [TipoProyectoModule],
  controllers: [ProyectoController],
  providers: [
    ProyectoService,
    { provide: 'IProyectoRepository', useClass: ProyectoRepository },
  ],
  exports: [ProyectoService],
})
export class ProyectoModule {}
