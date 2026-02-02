import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HsFormWidgetEntity } from '../../../../database/entities/hs-form-widget.entity'; // 确保实体类名已改为 HsFormWidgetEntity
import { IWidgetType } from '@heartsync/types';
import { CreateFormWidgetDto } from './dto/create-form-widget.dto';
import { UpdateFormWidgetDto } from './dto/update-form-widget.dto';
import { WidgetStrategy } from '../../model/widget-strategy.interface';
// import { UpdateFormWidgetDto } from './dto/update-form-widget.dto';
@Injectable()
export class HsFormWidgetsService implements WidgetStrategy {
  type = IWidgetType.FORM;

  constructor(
    @InjectRepository(HsFormWidgetEntity)
    public widgetsRepository: Repository<HsFormWidgetEntity>,
  ) {}

  async createWidget(
    createFormWidgetDto: CreateFormWidgetDto,
  ): Promise<HsFormWidgetEntity> {
    const formWidget = this.widgetsRepository.create(createFormWidgetDto);
    return await this.widgetsRepository.save(formWidget);
  }

  async getAllFormWidgets(): Promise<HsFormWidgetEntity[]> {
    return await this.widgetsRepository.find();
  }

  async getWidgetById(id: string): Promise<HsFormWidgetEntity> {
    return await this.widgetsRepository.findOneBy({ id });
  }

  // async getFormWidgetByWidgetId(widgetId: string): Promise<HsFormWidgetEntity> {
  //   return await this.widgetsRepository.findOneBy({ widgetId });
  // }

  async updateWidget(
    id: string,
    updateFormWidgetDto: UpdateFormWidgetDto,
  ): Promise<HsFormWidgetEntity> {
    await this.widgetsRepository.update({ id }, updateFormWidgetDto);
    return await this.getWidgetById(id);
  }

  async deleteWidget(id: string): Promise<void> {
    await this.widgetsRepository.delete({ id });
  }
}
