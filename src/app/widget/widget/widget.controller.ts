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
