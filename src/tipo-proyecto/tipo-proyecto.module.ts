import { Module } from '@nestjs/common';
import { TipoProyectoService } from './tipo-proyecto.service';
import { TipoProyectoRepository } from './repositories/tipo-proyecto.repository';
import { TipoProyectoController } from './tipo-proyecto.controller';

@Module({
  controllers: [TipoProyectoController],
  providers: [
    TipoProyectoService,
    { provide: 'ITipoProyectoRepository', useClass: TipoProyectoRepository },
  ],
  exports: [TipoProyectoService],
})
export class TipoProyectoModule {}
