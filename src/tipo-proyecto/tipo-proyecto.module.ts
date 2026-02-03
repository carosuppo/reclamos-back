import { Module } from '@nestjs/common';
import { TipoProyectoRepository } from './repositories/tipo-proyecto.repository';
import { TipoProyectoController } from './tipo-proyecto.controller';
import { TipoProyectoService } from './tipo-proyecto.service';
import { TipoProyectoValidator } from './validators/tipo-proyecto.validator';

@Module({
  controllers: [TipoProyectoController],
  providers: [
    TipoProyectoService,
    TipoProyectoValidator,
    { provide: 'ITipoProyectoRepository', useClass: TipoProyectoRepository },
  ],
  exports: [TipoProyectoService, TipoProyectoValidator],
})
export class TipoProyectoModule {}
