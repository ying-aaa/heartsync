import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HsCodeWidget } from './code-widget.entity';
import { HsCodeWidgetsService } from './code-widget.service';

@Controller('/widget/code')
export class HsCodeWidgetsController {
  constructor(private hsCodeWidgetsService: HsCodeWidgetsService) {}

  @Post()
  async createHsCodeWidget(
    @Body() createHsCodeWidgetDto: any,
  ): Promise<HsCodeWidget> {
    return await this.hsCodeWidgetsService.createHsCodeWidget(
      createHsCodeWidgetDto,
    );
  }

  @Get()
  async getAllHsCodeWidgets(): Promise<HsCodeWidget[]> {
    return await this.hsCodeWidgetsService.getAllHsCodeWidgets();
  }

  @Get(':id')
  async getHsCodeWidgetById(@Param('id') id: number): Promise<HsCodeWidget> {
    return await this.hsCodeWidgetsService.getHsCodeWidgetById(id);
  }

  @Put(':id')
  async updateHsCodeWidget(
    @Param('id') id: number,
    @Body() updateHsCodeWidgetDto: any,
  ): Promise<HsCodeWidget> {
    return await this.hsCodeWidgetsService.updateHsCodeWidget(
      id,
      updateHsCodeWidgetDto,
    );
  }

  @Delete(':id')
  async deleteHsCodeWidget(@Param('id') id: number): Promise<void> {
    return await this.hsCodeWidgetsService.deleteHsCodeWidget(id);
  }
}
