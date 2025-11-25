import { Module } from '@nestjs/common';
import { ProyectoService } from './proyecto.service';
import { ProyectoController } from './proyecto.controller';
import { ProyectoRepository } from './repositories/proyecto.repository';
import { TipoProyectoModule } from 'src/tipo-proyecto/tipo-proyecto.module';
import { ProyectoValidador } from './validator/proyecto.validator';

@Module({
  imports: [TipoProyectoModule],
  controllers: [ProyectoController],
  providers: [
    ProyectoService,
    ProyectoValidador,
    { provide: 'IProyectoRepository', useClass: ProyectoRepository },
  ],
  exports: [ProyectoValidador],
})
export class ProyectoModule {}
