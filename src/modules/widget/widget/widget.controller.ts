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
import { PageDto } from 'src/common/dtos/page.dto';
import { HsWidgetEntity } from 'src/database/entities/hs-widget.entity';
import { BaseWidgetDto } from './dto/base-widget.dto';
import { IWidgetType } from '@heartsync/types';
import { QueryWidgetDto } from './dto/query-widget.dto';

@Controller('widgets')
export class HsWidgetController {
  constructor(private readonly widgetService: HsWidgetService) {}

  @Post()
  create(@Body() createDto: BaseWidgetDto) {
    return this.widgetService.create(createDto);
  }

  @Get()
  findAll(
    @Query() queryWidgetDto: QueryWidgetDto,
  ): Promise<PageDto<HsWidgetEntity>> {
    return this.widgetService.findAll(queryWidgetDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('type') type: IWidgetType) {
    return this.widgetService.findOne(id, type);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDto: BaseWidgetDto) {
    return this.widgetService.update(id, updateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('type') type: IWidgetType) {
    return this.widgetService.remove(id, type);
  }
}
