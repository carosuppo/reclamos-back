import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { AreaRepository } from './repositories/area.repository';

@Module({
  controllers: [AreaController],
  providers: [
    AreaService,
    {
      provide: 'IAreaRepository',
      useClass: AreaRepository,
    },
  ],
  exports: [AreaService],
})
export class AreaModule {}
