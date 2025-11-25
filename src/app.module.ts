import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProyectoModule } from './proyecto/proyecto.module';
import { TipoProyectoModule } from './tipo-proyecto/tipo-proyecto.module';

@Module({
  imports: [ProyectoModule, TipoProyectoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
