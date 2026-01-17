import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HsWidgetService } from './widget.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { WidgetType } from 'src/database/entities/hs-widget.entity';

@Controller('widgets')
export class HsWidgetController {
  constructor(private readonly widgetService: HsWidgetService) {}

  @Post()
  create(@Body() createDto: CreateWidgetDto) {
    return this.widgetService.create(createDto);
  }

  @Get()
  findAll() {
    return this.widgetService.findAll();
  }

  // 根据部件类型获取部件
  @Get('type/:type')
  findByType(@Param('type') type: WidgetType) {
    return this.widgetService.findByType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.widgetService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateWidgetDto) {
    return this.widgetService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.widgetService.remove(id);
  }
}
