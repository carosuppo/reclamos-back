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
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AreaDto } from './dtos/area.dto';

@Controller('area')
export class AreaController {
  constructor(private readonly service: AreaService) {}

  @ApiResponse({ type: AreaDto })
  @ApiBody({ type: CreateAreaDto })
  @Post()
  create(@Body() createAreaDto: CreateAreaDto) {
    return this.service.create(createAreaDto);
  }

  @ApiResponse({ type: AreaDto, isArray: true })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiResponse({ type: AreaDto })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @ApiResponse({ type: AreaDto })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAreaDto: UpdateAreaDto) {
    return this.service.update(id, updateAreaDto);
  }

  @Delete(':id')
  softDelete(@Param('id') id: string) {
    return this.service.softDelete(id);
  }
}
