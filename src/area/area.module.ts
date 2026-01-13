import { Module } from '@nestjs/common';
import { AreaController } from './area.controller';
import { AreaService } from './area.service';
import { AreaRepository } from './repositories/area.repository';
import { AreaValidator } from './validators/area.validator';

@Module({
  controllers: [AreaController],
  providers: [
    AreaService,
    AreaValidator,
    {
      provide: 'IAreaRepository',
      useClass: AreaRepository,
    },
  ],
  exports: [AreaService, AreaValidator],
})
export class AreaModule {}
