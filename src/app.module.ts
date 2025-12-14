import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { ReclamoModule } from './reclamo/reclamo.module';
import { AreaModule } from './area/area.module';
import { TipoReclamoModule } from './tipo-reclamo/tipo-reclamo.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { TipoProyectoModule } from './tipo-proyecto/tipo-proyecto.module';
import { ClienteModule } from './cliente/cliente.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CambioEstadoModule } from './cambio-estado/cambio-estado.module';

@Module({
  imports: [
    ProyectoModule,
    TipoProyectoModule,
    ReclamoModule,
    AreaModule,
    TipoReclamoModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    EmpleadoModule,
    ClienteModule,
    CambioEstadoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
