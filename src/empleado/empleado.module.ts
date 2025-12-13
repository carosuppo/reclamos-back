import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoRepository } from './repositories/empleado.repository';
import { AreaModule } from 'src/area/area.module';

@Module({
  imports: [AreaModule],
  controllers: [EmpleadoController],
  providers: [
    EmpleadoService,
    EmpleadoRepository,
    { provide: 'IEmpleadoRepository', useClass: EmpleadoRepository },
  ],
  exports: [EmpleadoService],
})
export class EmpleadoModule {}
