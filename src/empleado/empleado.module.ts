import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoRepository } from './repositories/empleado.repository';

@Module({
  controllers: [EmpleadoController],
  providers: [EmpleadoService, EmpleadoRepository],
  exports: [EmpleadoService],
})
export class EmpleadoModule {}
