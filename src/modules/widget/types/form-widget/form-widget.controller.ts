import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { HsFormWidgetEntity } from '../../../../database/entities/hs-form-widget.entity';
import { HsFormWidgetsService } from './form-widget.service';
// import { UpdateFormWidgetDto } from './dto/update-form-widget.dto';
import { CreateFormWidgetDto } from './dto/create-form-widget.dto';
import { UpdateFormWidgetDto } from './dto/update-form-widget.dto';

@Controller('/widget/form')
export class HsFormWidgetsController {
  constructor(private formWidgetsService: HsFormWidgetsService) {}

  @Post()
  async createFormWidget(
    @Body() createFormWidgetDto: CreateFormWidgetDto,
  ): Promise<HsFormWidgetEntity> {
    return await this.formWidgetsService.createWidget(createFormWidgetDto);
  }

  @Get()
  async getAllFormWidgets(): Promise<HsFormWidgetEntity[]> {
    return await this.formWidgetsService.getAllFormWidgets();
  }

  @Get(':id')
  async getFormWidgetById(
    @Param('id') id: string,
  ): Promise<HsFormWidgetEntity> {
    return await this.formWidgetsService.getWidgetById(id);
  }

  // @Get('widget/:widgetId')
  // async getFormWidgetByWidgetId(
  //   @Param('widgetId') widgetId: string,
  // ): Promise<HsFormWidgetEntity> {
  //   return await this.formWidgetsService.getFormWidgetByWidgetId(widgetId);
  // }

  @Put(':id')
  async updateFormWidget(
    @Param('id') id: string,
    @Body() updateFormWidgetDto: UpdateFormWidgetDto,
  ): Promise<HsFormWidgetEntity> {
    return await this.formWidgetsService.updateWidget(id, updateFormWidgetDto);
  }

  @Delete(':id')
  async deleteFormWidget(@Param('id') id: string): Promise<void> {
    return await this.formWidgetsService.deleteWidget(id);
  }
}
