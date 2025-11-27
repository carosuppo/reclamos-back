import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReclamoModule } from './reclamo/reclamo.module';
import { AreaModule } from './area/area.module';
import { TipoReclamoModule } from './tipo-reclamo/tipo-reclamo.module';

@Module({
  imports: [ReclamoModule, AreaModule, TipoReclamoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
