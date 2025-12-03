import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ClienteModule } from './cliente/cliente.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReclamoModule } from './reclamo/reclamo.module';
import { AreaModule } from './area/area.module';
import { TipoReclamoModule } from './tipo-reclamo/tipo-reclamo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ClienteModule,
    EmpleadoModule,
    ReclamoModule,
    AreaModule,
    TipoReclamoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
