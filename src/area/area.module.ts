import { Module } from '@nestjs/common';
import { AreaService } from './area.service';
import { AreaController } from './area.controller';
import { AreaRepository } from './repository/area.repository';

@Module({
  controllers: [AreaController],
  providers: [
    AreaService,
    {
      provide: 'IAreaRepository',
      useClass: AreaRepository,
    },
  ],
})
export class AreaModule {}
