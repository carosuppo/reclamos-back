import { forwardRef, Module } from '@nestjs/common';
import { AreaModule } from '../area/area.module';
import { AuthModule } from '../auth/auth.module';
import { EmpleadoController } from './empleado.controller';
import { EmpleadoService } from './empleado.service';
import { EmpleadoRepository } from './repositories/empleado.repository';
import { EmpleadoValidator } from './validators/empleado.validator';

@Module({
  imports: [AreaModule, forwardRef(() => AuthModule)],
  controllers: [EmpleadoController],
  providers: [
    EmpleadoService,
    EmpleadoValidator,
    { provide: 'IEmpleadoRepository', useClass: EmpleadoRepository },
  ],
  exports: [EmpleadoService, EmpleadoValidator],
})
export class EmpleadoModule {}
