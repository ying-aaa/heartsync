import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Widget } from './widget.entity';
import { WidgetsService } from './widgets.service';

@Controller('widgets')
export class WidgetsController {
  constructor(private widgetsService: WidgetsService) {}

  @Post()
  async createWidget(@Body() createWidgetDto: any): Promise<Widget[]> {
    return await this.widgetsService.createWidget(createWidgetDto);
  }

  @Get()
  async getAllWidgets(): Promise<Widget[]> {
    return await this.widgetsService.getAllWidgets();
  }

  @Get(':id')
  async getWidgetById(@Param('id') id: number): Promise<Widget> {
    return await this.widgetsService.getWidgetById(id);
  }

  @Put(':id')
  async updateWidget(
    @Param('id') id: number,
    @Body() updateWidgetDto: any,
  ): Promise<Widget> {
    return await this.widgetsService.updateWidget(id, updateWidgetDto);
  }

  @Delete(':id')
  async deleteWidget(@Param('id') id: number): Promise<void> {
    return await this.widgetsService.deleteWidget(id);
  }
}
