import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { HsWidgetService } from './widget.service';
import { CreateWidgetDto } from './dto/create-widget.dto';
import { UpdateWidgetDto } from './dto/update-widget.dto';
import { QueryWidgetDto } from './dto/query-widget.dto';
import { PageDto } from 'src/common/dtos/page.dto';
import { HsWidgetEntity } from 'src/database/entities/hs-widget.entity';

@Controller('widgets')
export class HsWidgetController {
  constructor(private readonly widgetService: HsWidgetService) {}

  @Post()
  create(@Body() createDto: CreateWidgetDto) {
    return this.widgetService.create(createDto);
  }

  @Get()
  findAll(
    @Query() queryWidgetDto: QueryWidgetDto,
  ): Promise<PageDto<HsWidgetEntity>> {
    return this.widgetService.findAll(queryWidgetDto);
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
