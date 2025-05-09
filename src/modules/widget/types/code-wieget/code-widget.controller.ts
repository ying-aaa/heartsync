import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HsCodeWidget } from '../../../../database/entities/hs-code-widget.entity';
import { HsCodeWidgetsService } from './code-widget.service';

@Controller('/widget/code')
export class HsCodeWidgetsController {
  constructor(private hsCodeWidgetsService: HsCodeWidgetsService) {}

  @Post()
  async createHsCodeWidget(
    @Body() createHsCodeWidgetDto: any,
  ): Promise<HsCodeWidget> {
    return await this.hsCodeWidgetsService.createWidget(
      createHsCodeWidgetDto.widgetId,
      createHsCodeWidgetDto,
    );
  }

  @Get()
  async getAllHsCodeWidgets(): Promise<HsCodeWidget[]> {
    return await this.hsCodeWidgetsService.getAllHsCodeWidgets();
  }

  @Get(':widgetId')
  async getHsCodeWidgetById(
    @Param('widgetId') widgetId: string,
  ): Promise<HsCodeWidget> {
    return await this.hsCodeWidgetsService.getHsCodeWidgetById(widgetId);
  }

  @Put(':widgetId')
  async updateHsCodeWidget(
    @Param('widgetId') widgetId: string,
    @Body() updateHsCodeWidgetDto: any,
  ): Promise<HsCodeWidget> {
    return await this.hsCodeWidgetsService.updateWidget(
      widgetId,
      updateHsCodeWidgetDto,
    );
  }

  @Delete(':widgetId')
  async deleteHsCodeWidget(@Param('widgetId') widgetId: string): Promise<void> {
    return await this.hsCodeWidgetsService.deleteWidget(widgetId);
  }
}
