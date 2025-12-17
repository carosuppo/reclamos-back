import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { AreaService } from './area.service';
import { CreateAreaDto } from './dtos/create-area.dto';
import { UpdateAreaDto } from './dtos/update-area.dto';
import {
  SwaggerCreateArea,
  SwaggerDeleteArea,
  SwaggerFindAllArea,
  SwaggerFindOneArea,
  SwaggerUpdateArea,
} from './swaggers/area.swagger';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access-token')
@Controller('area')
export class AreaController {
  constructor(private readonly service: AreaService) {}

  @SwaggerCreateArea()
  @SwaggerCreateArea()
  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.service.create(createAreaDto);
  }

  @SwaggerFindAllArea()
  @SwaggerFindAllArea()
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @SwaggerFindOneArea()
  @SwaggerFindOneArea()
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @SwaggerUpdateArea()
  @SwaggerUpdateArea()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.service.update(id, updateAreaDto);
  }

  @SwaggerDeleteArea()
  @SwaggerDeleteArea()
  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
