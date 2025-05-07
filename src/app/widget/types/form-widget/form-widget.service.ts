import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsFormWidget } from './form-widget.entity'; // 确保实体类名已改为 HsFormWidget
import { WidgetStrategy } from 'src/app/widget/model/widget-strategy.interface';
import { WidgetType } from '../../entities/widget.entity';
@Injectable()
export class HsFormWidgetsService implements WidgetStrategy {
  type = WidgetType.FORM;

  constructor(
    @InjectRepository(HsFormWidget)
    private formWidgetsRepository: Repository<HsFormWidget>,
  ) {}

  async createWidget(
    widgetId: string,
    createFormWidgetDto: any,
  ): Promise<HsFormWidget[]> {
    const formWidget = this.formWidgetsRepository.create({
      ...createFormWidgetDto,
      id: widgetId,
    });
    return await this.formWidgetsRepository.save(formWidget);
  }

  async getAllFormWidgets(): Promise<HsFormWidget[]> {
    return await this.formWidgetsRepository.find();
  }

  async getFormWidgetById(id: string): Promise<HsFormWidget> {
    return await this.formWidgetsRepository.findOneBy({ id });
  }

  async updateWidget(
    id: string,
    updateFormWidgetDto: any,
  ): Promise<HsFormWidget> {
    await this.formWidgetsRepository.update(id, updateFormWidgetDto);
    return await this.getFormWidgetById(id);
  }

  async deleteWidget(id: string): Promise<void> {
    await this.formWidgetsRepository.delete(id);
  }
}
