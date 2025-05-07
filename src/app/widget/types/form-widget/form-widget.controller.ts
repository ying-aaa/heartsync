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
// import { UpdateFormWidgetDto } from './dto/update-form-widget.dto';
import { CreateFormWidgetDto } from './dto/create-form-widget.dto';

@Controller('/widget/form')
export class HsFormWidgetsController {
  constructor(private formWidgetsService: HsFormWidgetsService) {}

  @Post()
  async createFormWidget(
    @Body() createFormWidgetDto: CreateFormWidgetDto,
  ): Promise<HsFormWidget> {
    return await this.formWidgetsService.createWidget(
      createFormWidgetDto.widgetId,
      createFormWidgetDto,
    );
  }

  @Get()
  async getAllFormWidgets(): Promise<HsFormWidget[]> {
    return await this.formWidgetsService.getAllFormWidgets();
  }

  @Get(':widgetId')
  async getFormWidgetById(
    @Param('widgetId') widgetId: string,
  ): Promise<HsFormWidget> {
    return await this.formWidgetsService.getFormWidgetByWidgetId(widgetId);
  }

  // @Get('widget/:widgetId')
  // async getFormWidgetByWidgetId(
  //   @Param('widgetId') widgetId: string,
  // ): Promise<HsFormWidget> {
  //   return await this.formWidgetsService.getFormWidgetByWidgetId(widgetId);
  // }

  @Put(':widgetId')
  async updateFormWidget(
    @Param('widgetId') widgetId: string,
    @Body() updateFormWidgetDto: any,
  ): Promise<HsFormWidget> {
    return await this.formWidgetsService.updateWidget(
      widgetId,
      updateFormWidgetDto,
    );
  }

  @Delete(':widgetId')
  async deleteFormWidget(@Param('widgetId') widgetId: string): Promise<void> {
    return await this.formWidgetsService.deleteWidget(widgetId);
  }
}
