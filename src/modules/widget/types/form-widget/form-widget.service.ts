import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsFormWidget } from '../../../../database/entities/hs-form-widget.entity'; // 确保实体类名已改为 HsFormWidget
import { WidgetStrategy } from 'src/modules/widget/model/widget-strategy.interface';
import { WidgetType } from '../../../../database/entities/hs-widget.entity';
import { CreateFormWidgetDto } from './dto/create-form-widget.dto';
// import { UpdateFormWidgetDto } from './dto/update-form-widget.dto';
@Injectable()
export class HsFormWidgetsService implements WidgetStrategy {
  type = WidgetType.FORM;

  constructor(
    @InjectRepository(HsFormWidget)
    private formWidgetsRepository: Repository<HsFormWidget>,
  ) {}

  async createWidget(
    widgetId: string,
    createFormWidgetDto: CreateFormWidgetDto,
  ): Promise<HsFormWidget> {
    const formWidget = this.formWidgetsRepository.create({
      ...createFormWidgetDto,
      widgetId,
    });
    return await this.formWidgetsRepository.save(formWidget);
  }

  async getAllFormWidgets(): Promise<HsFormWidget[]> {
    return await this.formWidgetsRepository.find();
  }

  async getFormWidgetByWidgetId(widgetId: string): Promise<HsFormWidget> {
    return await this.formWidgetsRepository.findOneBy({ widgetId });
  }

  // async getFormWidgetByWidgetId(widgetId: string): Promise<HsFormWidget> {
  //   return await this.formWidgetsRepository.findOneBy({ widgetId });
  // }

  async updateWidget(
    widgetId: string,
    updateFormWidgetDto: any,
  ): Promise<HsFormWidget> {
    await this.formWidgetsRepository.update({ widgetId }, updateFormWidgetDto);
    return await this.getFormWidgetByWidgetId(widgetId);
  }

  async deleteWidget(widgetId: string): Promise<void> {
    await this.formWidgetsRepository.delete({ widgetId });
  }
}
