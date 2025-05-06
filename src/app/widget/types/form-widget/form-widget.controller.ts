import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HsFormWidget } from './form-widget.entity';
import { HsFormWidgetsService } from './form-widget.service';

@Controller('/widget/form')
export class HsFormWidgetsController {
  constructor(private formWidgetsService: HsFormWidgetsService) {}

  @Post()
  async createFormWidget(
    @Body() createFormWidgetDto: any,
  ): Promise<HsFormWidget[]> {
    return await this.formWidgetsService.createWidget(
      createFormWidgetDto.id,
      createFormWidgetDto,
    );
  }

  @Get()
  async getAllFormWidgets(): Promise<HsFormWidget[]> {
    return await this.formWidgetsService.getAllFormWidgets();
  }

  @Get(':id')
  async getFormWidgetById(@Param('id') id: string): Promise<HsFormWidget> {
    return await this.formWidgetsService.getFormWidgetById(id);
  }

  @Put(':id')
  async updateFormWidget(
    @Param('id') id: string,
    @Body() updateFormWidgetDto: any,
  ): Promise<HsFormWidget> {
    return await this.formWidgetsService.updateWidget(id, updateFormWidgetDto);
  }

  @Delete(':id')
  async deleteFormWidget(@Param('id') id: string): Promise<void> {
    return await this.formWidgetsService.deleteWidget(id);
  }
}
